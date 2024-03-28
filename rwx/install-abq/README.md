## rwx/install-abq

ABQ is a universal test runner that runs test suites in parallel. It’s the best tool for splitting test suites into parallel jobs locally or on CI. ABQ is implemented in Rust with bindings available for several test frameworks.

To install the ABQ CLI:

```yaml
tasks:
  - key: abq
    call: rwx/install-abq 1.0.2
    with:
      rwx-access-token: ${{ secrets.RWX_ACCESS_TOKEN }}
```

You will need to have an `RWX_ACCESS_TOKEN` set in your vault.

Generate access tokens at:

https://cloud.rwx.com/org/deep_link/manage/access_tokens

And access your vaults at:

https://cloud.rwx.com/mint/deep_link/vaults

ABQ Documentation:

https://www.rwx.com/docs/abq
