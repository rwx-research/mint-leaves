# mint/install-ruby

You'll either need to specify `ruby-version` or `ruby-version-file`


```yaml
tasks:
  - key: ruby
    call: mint/install-ruby 0.0.0
    with:
      ruby-version: 3.2.2
```

Or with a file named `.ruby-version` containing the version of ruby to install:

```yaml
tasks:
  - key: ruby
    call: mint/install-ruby 0.0.0
    with:
      ruby-version-file: .ruby-version
    filter:
      - .ruby-version
```

Remember to include the [`filter`](https://www.rwx.com/docs/mint/filtering-files) so that the task will be cached.
