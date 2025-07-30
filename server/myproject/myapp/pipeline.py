def save_github_token(backend, user, response, *args, **kwargs):
    if backend.name == 'github':
        user.github_token = response.get('access_token')
        user.save()