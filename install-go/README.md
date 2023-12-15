# mint/install-go

To install the latest version of go:

```yaml
tasks:
  - key: go
    call: mint/install-go 0.0.0
```

To install a specific version:

```yaml
tasks:
  - key: go
    call: mint/install-go 0.0.0
    with:
      version: 1.21.5
```
