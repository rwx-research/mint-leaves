# docker/login-hook

Log in to a Docker registry using the specified username. Any task that depends on this leaf and that specifies a
password or token as the `DOCKER_PASSWORD` environment variable will attempt to log in to the Docker registry for the
duration of the task.

To avoid persisting credentials to disk, the Docker credentials are cleaned up at the end of each task. Subsequent
tasks that need Docker authentication must also specify the `DOCKER_PASSWORD` environment variable.

Docker Hub is the default registry. If you need to log in to a different registry, you can provide the server address
of the registry as the `registry` parameter to this leaf.

## Example

```yaml
tasks:
  - key: docker-login
    call: docker/login-hook 1.0.0
    with:
      username: my-username

  - key: docker-images
    use: docker-login
    docker: preserve-data
    run: docker compose pull
    env:
      DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
```

Override the registry and name of subsequent token/password environment variable:

```yaml
tasks:
  - key: docker-login
    call: docker/login-hook 1.0.0
    with:
      username: my-username
      password-env-name: MY_ENVVAR_NAME
      registry: custom-registry.your-company.com

  - key: test-dependencies
    use: docker-login
    docker: preserve-data
    run: docker compose pull
    env:
      MY_ENVVAR_NAME: ${{ secrets.DOCKER_PASSWORD }}
```

## Docker Hub

When authenticating with [Docker Hub](https://hub.docker.com/), we recommend using an
[organization access token](https://docs.docker.com/security/for-admins/access-tokens/). Use your Docker Hub
organization name for the username and the access token for the password:

```yaml
tasks:
  - key: docker-login
    call: docker/login-hook 1.0.0
    with:
      username: my-docker-organization

  - key: docker-images
    use: docker-login
    docker: preserve-data
    run: docker compose pull
    env:
      DOCKER_PASSWORD: ${{ secrets.DOCKER_ORGANIZATION_ACCESS_TOKEN }}
```
