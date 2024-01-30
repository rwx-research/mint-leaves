# mint/install-ruby

We currently support Ruby versions 3.0.3 through 3.3.0. You'll either need to specify `ruby-version` or `ruby-version-file`.

## With a .ruby-version file

If your project has a `.ruby-version` file:

```yaml
tasks:
  - key: ruby
    call: mint/install-ruby 1.0.6
    with:
      ruby-version-file: .ruby-version
    filter: [.ruby-version]
```

Remember to include the [`filter`](https://www.rwx.com/docs/mint/filtering-files) so that the task will be cached only based on the contents of the `.ruby-version` file.

## Specifying a version

If your project does not have a `.ruby-version` file, you can specify the version manually in your Mint task:

```yaml
tasks:
  - key: ruby
    call: mint/install-ruby 1.0.6
    with:
      ruby-version: 3.2.2
```
