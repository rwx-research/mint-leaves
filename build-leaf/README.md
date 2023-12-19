# mint/build-leaf

Use this leaf to build a leaf.

## git dir

Building a leaf requires access to the `.git` directory from cloning a leaf.
Therefore, when using the [`mint/git-clone`](https://cloud.rwx.com/leaves/mint/git-clone/1.0.0) leaf, make sure you set `preserve-git-dir` to `true`.


```yaml
- key: code
  call: mint/git-clone 1.0.0
  with:
    preserve-git-dir: true
    repository: https://github.com/your-org/your-leaf-repo.git
    ref: ${{ init.sha }}
```

### Full Explanation

Leaves are built as zip file archives and are identified by the hash of the zip file.
Therefore, the zip files need to be deterministic to ensure that unchanged leaf contents result in an unchanged archive.
Because a fresh git clone will result in a changed `mtime`, `build-leaf` needs to set the `mtime` to a deterministic value to ensure that the zip file will be deterministic.
Currently, `build-leaf` determines the `mtime` from git commit history.

## Building a Leaf

In this example, `code` is the key of the `mint/git-clone` task which cloned the repository containing the leaf contents.

The leaf contents are assumed to be in a `src` directory inside the repository.
However, if you have a monorepo with multiple leaves, you may want to place each leaf in a directory matching its name, such as `my-leaf1` and `my-leaf2`.

You should add a filter to the task to only include the source directory containing the leaf contents and the `.git` directory.

```yaml
- key: build
  use: code
  call: mint/build-leaf 0.0.1
  with:
    dir: src
    rwx-access-token: ${{ secrets.RWX_ACCESS_TOKEN }}
  filter:
    - .git
    - src
```
