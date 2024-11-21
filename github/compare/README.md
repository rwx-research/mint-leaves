# github/compare

Compares two git refs to determine which files changed and whether they match supplied patterns.

Two values are output from this leaf: `has-changes` and `have-changes`. They'll both have the same value and both will be either `true` or `false`.

## A single pattern

```yaml
tasks:
  - key: github-cli
    call: github/install-cli 1.0.1

  - key: go-files
    use: github-cli
    call: github/compare 1.0.0
    with:
      repository: my-organization/my-repository
      base-ref: abc123
      head-ref: def456
      github-token: ${{ github.token }}
      patterns: "**/*.go"

  - key: build-go
    if: ${{ tasks.go-files.values.have-changes }
    run: go build
```

## Multiple patterns

```yaml
tasks:
  - key: github-cli
    call: github/install-cli 1.0.1

  - key: go-files
    use: github-cli
    call: github/compare 1.0.0
    with:
      repository: my-organization/my-repository
      base-ref: abc123
      head-ref: def456
      github-token: ${{ github.token }}
      patterns: |
        **/*.go
        go.mod
        go.sum

  - key: build-go
    if: ${{ tasks.go-files.values.have-changes }
    run: go build
```

## From a GitHub Push Trigger

```yaml
on:
  github:
    push:
      - if: ${{ event.git.branch == "main" }}
        init:
          base-ref: ${{ event.github.push.before }}
          head-ref: ${{ event.git.sha }}

      - if: ${{ event.git.branch != "main" }}
        init:
          base-ref: main
          head-ref: ${{ event.git.sha }}

tasks:
  - key: github-cli
    call: github/install-cli 1.0.1

  - key: go-files
    use: github-cli
    call: github/compare 1.0.0
    with:
      repository: my-organization/my-repository
      base-ref: ${{ init.base-ref }}
      head-ref: ${{ init.head-ref }}
      github-token: ${{ github.token }}
      patterns: |
        **/*.go
        go.mod
        go.sum

  - key: build-go
    if: ${{ tasks.go-files.values.have-changes }
    run: go build
```

## From a GitHub Pull Request Trigger

```yaml
on:
  github:
    pull_request:
      init:
        base-ref: ${{ event.github.pull_request.pull_request.base.sha }}
        head-ref: ${{ event.git.sha }

tasks:
  - key: github-cli
    call: github/install-cli 1.0.1

  - key: go-files
    use: github-cli
    call: github/compare 1.0.0
    with:
      repository: my-organization/my-repository
      base-ref: ${{ init.base-ref }}
      head-ref: ${{ init.head-ref }}
      github-token: ${{ github.token }}
      patterns: |
        **/*.go
        go.mod
        go.sum

  - key: build-go
    if: ${{ tasks.go-files.values.have-changes }
    run: go build
```
