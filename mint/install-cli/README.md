# mint/install-cli

To install the latest version of the Mint CLI:

```yaml
tasks:
  - key: mint-cli
    call: mint/install-cli 1.0.1
```

To install a specific version of the Mint CLI:

```yaml
tasks:
  - key: mint-cli
    call: mint/install-cli 1.0.1
    with:
      cli-version: v0.0.12
```

For the list of available versions, see the releases on GitHub:

https://github.com/rwx-research/mint-cli/releases
