# mint/tool-versions

Extract the versions specified in a `.tool-versions` file, used by tools such as
[asdf](https://asdf-vm.com/) and [mise-en-place](https://mise.jdx.dev/).

Versions are available as [output values](https://www.rwx.com/docs/mint/output-values)
after calling this leaf.

## Example

If your project has a `.tool-versions` file:

```yaml
nodejs 22.4.1
ruby 3.3.2
```

Capture the versions to pass to other tasks:

```yaml
tasks:
  - key: tool-versions
    call: mint/tool-versions 1.0.0
    filter: [.tool-versions]
  - key: nodejs
    call: mint/install-node 1.0.8
    with:
      node-version: ${{ tasks.tool-versions.values.nodejs }}
    filter: []
  - key: ruby
    call: mint/install-ruby 1.0.12
    with:
      ruby-version: ${{ tasks.tool-versions.values.ruby }}
    filter: []
```

The output value is named based on the tool name, so we have `nodejs` and `ruby` in this example.

Remember to include the [`filter`](https://www.rwx.com/docs/mint/filtering-files) so that the task will be cached only based on the contents of the `.tool-versions` file.

Tasks such as `mint/install-ruby` in the example above can have an empty `filter`, since they'll be cached until their input parameters change.
