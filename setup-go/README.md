# mint/setup-go

To install the latest version of go:

```yaml
tasks:
  - key: go
    call: mint/setup-go 0.0.3
```

To install a specific version:

```yaml
tasks:
  - key: go
    call: mint/setup-go 0.0.3
    with:
      version: 1.21.5
```
