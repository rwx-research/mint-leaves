# mint/install-cli

To install the latest version of the Mint CLI:

```yaml
tasks:
  - key: mint-cli
    call: mint/install-cli 1.0.3
```

To install a specific version of the Mint CLI:

```yaml
tasks:
  - key: mint-cli
    call: mint/install-cli 1.0.3
    with:
      cli-version: v0.2.0
```

For the list of available versions, see the releases on GitHub:

https://github.com/rwx-research/mint-cli/releases
