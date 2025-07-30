from celery import shared_task
from datetime import datetime, timedelta
import requests
import time
from django.conf import settings
from .models import CustomUser, RepoActivity

GITHUB_API = "https://api.github.com"

def fetch_user_repos(token):
    headers = {"Authorization": f"token {token}"}
    url = f"{GITHUB_API}/user/repos"
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return [r for r in response.json() if not r.get("fork") and not r.get("archived")]

def fetch_commit_count(token, owner, repo, author, since_date):
    headers = {"Authorization": f"token {token}"}
    url = f"{GITHUB_API}/repos/{owner}/{repo}/commits"
    params = {"author": author, "since": since_date.isoformat() + "Z"}
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return len(response.json())

def fetch_code_frequency(token, owner, repo, retries=3, delay=2):
    headers = {"Authorization": f"token {token}"}
    url = f"{GITHUB_API}/repos/{owner}/{repo}/stats/code_frequency"
    for _ in range(retries):
        resp = requests.get(url, headers=headers)
        if resp.status_code == 202:
            time.sleep(delay)
            continue
        resp.raise_for_status()
        return resp.json()
    return []

@shared_task
def fetch_github_activity():
    since_date = datetime.utcnow() - timedelta(days=1)
    users = CustomUser.objects.exclude(github_token__isnull=True).exclude(github_token="")

    for user in users:
        token = user.github_token
        try:
            repos = fetch_user_repos(token)
        except Exception as e:
            # log or handle user token error (e.g. expired)
            continue

        for repo in repos:
            try:
                owner = repo["owner"]["login"]
                repo_name = repo["name"]

                commits = fetch_commit_count(token, owner, repo_name, user.username, since_date)
                code_freq = fetch_code_frequency(token, owner, repo_name)

                RepoActivity.objects.update_or_create(
                    user=user,
                    repo_name=repo_name,
                    date=since_date.date(),
                    defaults={
                        "commits_count": commits,
                        "code_frequency": code_freq,
                    }
                )

            except Exception as e:
                # log per-repo error but continue
                continue
