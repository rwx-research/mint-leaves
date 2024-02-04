# mint/install-node

You'll either need to specify `node-version` or `node-version-file`

## Specifying node-version


```yaml
tasks:
  - key: node
    call: mint/install-node 1.0.5
    with:
      node-version: 21.4.0
```

## .node-version file

Or with a file named `.node-version` containing the version of node to install:

```yaml
tasks:
  - key: node
    use: code # or whichever task provides the .node-version file
    call: mint/install-node 1.0.5
    with:
      node-version-file: .node-version
    filter:
      - .node-version
```

This example contains `use: code`.
It's common to have a task with key `code` that uses the `git-clone` leaf to clone your repository, but if your task that provides the `.node-version` file is named something else, you'll need to replace `use: code` with the appropriate task.

Remember to include the [`filter`](https://www.rwx.com/docs/mint/filtering-files) so that the task will be cached based only on the contents of `.node-version`.
