# mint/checkout


## Checkout Public Repositories

```yaml
tasks:
  - key: checkout
    call: mint/checkout 0.0.3
    with:
      repository: git@github.com:YOUR_ORG/YOUR_REPO.git
      ref: main
```

This example shows a hardcoded `ref` of `main`, but most of the time you'll pass the ref to checkout using an [init parameter](https://www.rwx.com/docs/mint/init-parameters) like this:

```
ref: ${{ init.ref }}
```

By using an init parameter, you can specify the ref when running via the Mint CLI while also setting the value based on version control events. For more examples see the Mint documentation on [getting started with GitHub](https://www.rwx.com/docs/mint/getting-started/github).

## Checkout Private Repositories

To checkout private repositories, you'll need to pass an `ssh-key`.

```yaml
tasks:
  - key: checkout
    call: mint/checkout 0.0.3
    with:
      repository: git@github.com:YOUR_ORG/YOUR_REPO.git
      ref: ${{ init.ref }}
      ssh-key: ${{ secrets.YOUR_REPO_CHECKOUT_SSH_KEY }}
```

You'll want to store your SSH key as a [Mint vault secret](https://www.rwx.com/docs/mint/security/vaults).


## GitHub

To create an SSH key which can clone a repository from GitHub, you'll want to use GitHub's Deploy Key feature. Documentation:

https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys

Documentation on Mint vault secrets:

https://www.rwx.com/docs/mint/security/vaults
