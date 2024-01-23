# mint/install-go

To install the latest version of go:

```yaml
tasks:
  - key: go
    call: mint/install-go 1.0.3
```

To install a specific version:

```yaml
tasks:
  - key: go
    call: mint/install-go 1.0.3
    with:
      go-version: 1.21.5
```
