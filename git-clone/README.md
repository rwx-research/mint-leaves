# mint/git-clone


## Clone Public Repositories

```yaml
tasks:
  - key: code
    call: mint/git-clone 0.0.1
    with:
      repository: git@github.com:YOUR_ORG/YOUR_REPO.git
      ref: main
```

This example shows a hardcoded `ref` of `main`, but most of the time you'll pass the ref to clone using an [init parameter](https://www.rwx.com/docs/mint/init-parameters) like this:

```
ref: ${{ init.ref }}
```

By using an init parameter, you can specify the ref when running via the Mint CLI while also setting the value based on version control events. For more examples see the Mint documentation on [getting started with GitHub](https://www.rwx.com/docs/mint/getting-started/github).

## Clone Private Repositories

To clone private repositories, you'll need to pass an `ssh-key`.

```yaml
tasks:
  - key: code
    call: mint/git-clone 0.0.1
    with:
      repository: git@github.com:YOUR_ORG/PROJECT.git
      ref: ${{ init.ref }}
      ssh-key: ${{ secrets.PROJECT_REPO_SSH_KEY }}
```

You'll want to store your SSH key as a [Mint vault secret](https://www.rwx.com/docs/mint/security/vaults).


## GitHub

To create an SSH key which can clone a repository from GitHub, you'll want to use GitHub's Deploy Key feature. Documentation:

https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys

Documentation on Mint vault secrets:

https://www.rwx.com/docs/mint/security/vaults
