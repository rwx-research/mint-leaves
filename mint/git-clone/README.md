# mint/git-clone

## Clone Public Repositories

```yaml
tasks:
  - key: code
    call: mint/git-clone 1.1.5
    with:
      repository: https://github.com/YOUR_ORG/YOUR_REPO.git
      ref: main
```

This example shows a hardcoded `ref` of `main`, but most of the time you'll pass the ref to clone using an [init parameter](https://www.rwx.com/docs/mint/init-parameters) like this:

```
ref: ${{ init.ref }}
```

By using an init parameter, you can specify the ref when running via the Mint CLI while also setting the value based on version control events. For more examples see the Mint documentation on [getting started with GitHub](https://www.rwx.com/docs/mint/getting-started/github).

## Clone Private Repositories

To clone private repositories, you'll either need to pass an `ssh-key` to clone over ssh, or a `github-access-token` to clone GitHub repositories over https.

### Cloning GitHub Repositories over HTTPS

If you're using GitHub, Mint will automatically provide a token in your secrets that you can use to clone your repositories.
Look in [your default vault](https://cloud.rwx.com/mint/deep_link/vaults) and you should see a secret named `*_CLONE_TOKEN` where `*` is your GitHub organization name in uppercase.

```yaml
tasks:
  - key: code
    call: mint/git-clone 1.1.5
    with:
      repository: https://github.com/YOUR_ORG/PROJECT.git
      ref: ${{ init.ref }}
      github-access-token: ${{ secrets.YOUR_ORG_CLONE_TOKEN }}
```

### Cloning over SSH

```yaml
tasks:
  - key: code
    call: mint/git-clone 1.1.5
    with:
      repository: git@github.com:YOUR_ORG/PROJECT.git
      ref: ${{ init.ref }}
      ssh-key: ${{ secrets.PROJECT_REPO_SSH_KEY }}
```

You'll want to store your SSH key as a [Mint vault secret](https://www.rwx.com/docs/mint/security/vaults).
