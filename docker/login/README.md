# docker/login

Set up a before hook to log in to a Docker registry when the provided token/password
environment variable is set in a subsequent task.

Be default, the task will log in to Docker Hub. If you need to log in to a different
registry, you can provide a `registry` parameter to this leaf.

## Example

```yaml
tasks:
  - key: docker-login
    call: docker/login 1.0.0
    with:
      username: ${{ vars.DOCKER_USERNAME }}
      
  - key: build-image
    use: docker-login
    docker: true
    run: |
      docker build -t your-image-name:your-image-tag .
    env:
      DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
```

Override the registry and name of subsequent token/password environment variable:

```yaml
tasks:
  - key: docker-login
    call: docker/login 1.0.0
    with:
      username: ${{ vars.DOCKER_USERNAME }}
      password-env-name: CUSTOM_DOCKER_TOKEN
      registry: custom-registry.your-company.com
      
  - key: test-dependencies
    use: docker-login
    docker: preserve-data
    run: docker compose pull
    env:
      CUSTOM_DOCKER_TOKEN: ${{ secrets.DOCKER_PASSWORD }}

  # `code` and `npm-install` tasks omitted for brevity
  - key: test
    use: [code, npm-install, test-dependencies]
    docker: true
    background-processes:
      - key: docker-compose
        run: docker compose up
    run: npm run test
```
