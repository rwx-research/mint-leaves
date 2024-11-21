# github/compare

Compares two git refs to determine which files changed and whether they match supplied patterns.

## A single pattern

```yaml
tasks:
  - key: github-cli
    call: github/install-cli 1.0.1

  - key: changed-go-files
    use: github-cli
    call: github/compare 1.0.0
    with:
      repository: my-organization/my-repository
      base-ref: abc123
      base-ref: def456
      github-token: ${{ github.token }}
      patterns: "**/*.go"

  - key: build-go
    if: ${{ tasks.changed-go-files.values.matches }
    run: go build
```

## Multiple patterns

```yaml
tasks:
  - key: github-cli
    call: github/install-cli 1.0.1

  - key: changed-go-files
    use: github-cli
    call: github/compare 1.0.0
    with:
      repository: my-organization/my-repository
      base-ref: abc123
      base-ref: def456
      github-token: ${{ github.token }}
      patterns: |
        **/*.go
        go.mod
        go.sum

  - key: build-go
    if: ${{ tasks.changed-go-files.values.matches }
    run: go build
```
