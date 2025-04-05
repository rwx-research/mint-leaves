# mint/install-cli

To install the latest version of the Mint CLI:

```yaml
tasks:
  - key: mint-cli
    call: mint/install-cli 1.0.6
```

To install a specific version of the Mint CLI:

```yaml
tasks:
  - key: mint-cli
    call: mint/install-cli 1.0.6
    with:
      cli-version: v1.3.3
```

For the list of available versions, see the releases on GitHub:

https://github.com/rwx-research/mint-cli/releases
