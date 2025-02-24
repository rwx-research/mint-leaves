# docker/login

Set up a before hook to log in to a Docker registry when the provided token/password
environment variable is set in a subsequent task.

Be default, the task will log in to Docker Hub. If you need to log in to a different
registry, you can provide a `registry` parameter to this leaf.

## Example

```yaml
tasks:
  # ... `build` task omitted for brevity

  - key: docker-login
    call: docker/login 1.0.0
    with:
      username: ${{ vars.DOCKER_USERNAME }}
      
  - key: push-image
    use: [build, docker-login]
    docker: true
    run: |
      docker push your-image-name:your-image-tag
    env:
      DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
```

Override the registry and name of subsequent token/password environment variable:

```yaml
tasks:
  # ... `build` task omitted for brevity

  - key: docker-login
    call: docker/login 1.0.0
    with:
      username: ${{ vars.DOCKER_USERNAME }}
      password-env-name: CUSTOM_DOCKER_TOKEN
      registry: custom-registry.your-company.com
      
  - key: push-image
    use: [build, docker-login]
    docker: true
    run: |
      docker push your-image-name:your-image-tag
    env:
      CUSTOM_DOCKER_TOKEN: ${{ secrets.DOCKER_PASSWORD }}
```
