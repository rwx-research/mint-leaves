# mint/install-erlang

To install Erlang:

```yaml
tasks:
  - key: erlang
    call: mint/install-erlang 1.0.4
    with:
      erlang-version: 26.2.3
```

## Supported Versions

This leaf installs Erlang using precompiled binaries available from Erlang Solutions.
See [their downloads page](https://www.erlang-solutions.com/downloads/) for supported versions.
