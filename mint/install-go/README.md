# mint/install-go

To install the latest version of go:

```yaml
tasks:
  - key: go
    call: mint/install-go 1.0.5
```

To install a specific version:

```yaml
tasks:
  - key: go
    call: mint/install-go 1.0.5
    with:
      go-version: 1.21.5
```

If the patch version is omitted, the latest patch version for the given minor
version will be downloaded.

A minor or patch version must be specified.
