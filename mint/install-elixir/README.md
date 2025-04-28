# mint/install-elixir

To install Elixir, you'll need to have Erlang installed.

```yaml
tasks:
  - key: erlang
    call: mint/install-erlang 1.0.4
    with:
      erlang-version: "26.2.3"

  - key: elixir
    use: erlang
    call: mint/install-elixir 1.0.3
    with:
      elixir-version: "1.17.2"
```

## Supported Versions

This leaf installs Elixir using precompiled binaries.
See [the GitHub releases](https://github.com/elixir-lang/elixir/releases) for supported versions.
