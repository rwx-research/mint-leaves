# mint/install-node

You'll either need to specify `node-version` or `node-version-file`


```yaml
tasks:
  - key: node
    call: mint/install-node 1.0.3
    with:
      node-version: 21.4.0
```

Or with a file named `.node-version` containing the version of node to install:

```yaml
tasks:
  - key: node
    call: mint/install-node 1.0.3
    with:
      node-version-file: .node-version
    filter:
      - .node-version
```

Remember to include the [`filter`](https://www.rwx.com/docs/mint/filtering-files) so that the task will be cached.
