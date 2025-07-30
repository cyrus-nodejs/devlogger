

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import json
from datetime import datetime, timedelta
import time
import requests

from django.conf import settings
from ..models import RepoActivity

GITHUB_API = "https://api.github.com"
GITHUB_GRAPHQL_API = "https://api.github.com/graphql"

def fetch_user_repos(github_token):
    headers = {"Authorization": f"token {github_token}"}
    url = f"{GITHUB_API}/user/repos"
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()


def fetch_commit_count(github_token, owner, repo, author, since_date):
    headers = {"Authorization": f"token {github_token}"}
    url = f"{GITHUB_API}/repos/{owner}/{repo}/commits"
    params = {
        "author": author,
        "since": since_date.isoformat() + "Z"
    }
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    commits = response.json()
    return len(commits)


def fetch_code_frequency(github_token, owner, repo, retries=3, delay=2):
    headers = {"Authorization": f"token {github_token}"}
    url = f"{GITHUB_API}/repos/{owner}/{repo}/stats/code_frequency"

    for _ in range(retries):
        response = requests.get(url, headers=headers)
        if response.status_code == 202:
            # Data is being generated; retry after delay
            time.sleep(delay)
            continue
        response.raise_for_status()
        return response.json()

    return []  # Fallback if data isn't available

def fetch_repo_languages(github_token, owner, repo):
    headers = {"Authorization": f"token {github_token}"}
    url = f"{GITHUB_API}/repos/{owner}/{repo}/languages"
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()  # Returns a dict like {"Python": 12345, "HTML": 6789}


def fetch_dependency_graph(token, owner, repo):
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    query = """
    query($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        dependencyGraphManifests(first: 10) {
          nodes {
            filename
            dependencies(first: 10) {
              nodes {
                packageName
                requirements
                repository {
                  nameWithOwner
                  url
                }
              }
            }
          }
        }
      }
    }
    """
    variables = {"owner": owner, "name": repo}
    json_data = {"query": query, "variables": variables}

    response = requests.post(GITHUB_GRAPHQL_API, headers=headers, json=json_data)
    response.raise_for_status()
    data = response.json()

    manifests = data.get("data", {}).get("repository", {}).get("dependencyGraphManifests", {}).get("nodes", [])
    results = []
    for manifest in manifests:
        deps = []
        for dep in manifest.get("dependencies", {}).get("nodes", []):
            deps.append({
                "packageName": dep.get("packageName"),
                "requirements": dep.get("requirements"),
                "repository": dep.get("repository", {}).get("nameWithOwner"),
                "repository_url": dep.get("repository", {}).get("url"),
            })
        results.append({
            "filename": manifest.get("filename"),
            "dependencies": deps,
        })
    return results

class GitHubActivityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        token = user.github_token
        print(token)
        if not token:
            return Response({"detail": "GitHub token missing"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            repos = fetch_user_repos(token)
        except requests.RequestException as e:
            return Response({"error": f"Failed to fetch repositories: {str(e)}"}, status=status.HTTP_502_BAD_GATEWAY)

        # Filter out forks and archived repos
        repos = [r for r in repos if not r.get("fork") and not r.get("archived")]

        # Optional: support ?days=7
        try:
            days = int(request.query_params.get("days", 30))
        except ValueError:
            days = 1

        since_date = datetime.utcnow() - timedelta(days=days)
        result = []

        for repo in repos:
            try:
                owner = repo["owner"]["login"]
                repo_name = repo["name"]

                commit_count = fetch_commit_count(token, owner, repo_name, user.username, since_date)
                code_freq = fetch_code_frequency(token, owner, repo_name)
                languages = fetch_repo_languages(token, owner, repo_name)
                dependency_graph = fetch_dependency_graph(token, owner, repo_name)
                print(json.dumps(dependency_graph, indent=2))
                # Save or update RepoActivity
                RepoActivity.objects.update_or_create(
                    user=user,
                    repo_name=repo_name,
                    date=since_date.date(),
                    defaults={
                        "commits_count": commit_count,
                        "code_frequency": code_freq,
                    }
                )

                result.append({
                    "repo_name": repo_name,
                    "repo_full_name": repo["full_name"],
                    "repo_id": repo["id"],
                    "commits_count": commit_count,
                    "code_frequency": code_freq,
                    "languages": languages,
                    "dependency_graph": dependency_graph,
                })

            except requests.RequestException as e:
                result.append({
                    "repo_name": repo.get("name", "unknown"),
                    "error": f"GitHub API error: {str(e)}"
                })
            except Exception as e:
                result.append({
                    "repo_name": repo.get("name", "unknown"),
                    "error": f"Unexpected error: {str(e)}"
                })

        return Response(result, status=status.HTTP_200_OK)
