# aws/assume-role

To assume a role:

```yaml
tasks:
  - key: aws-cli
    call: aws/install-cli 1.0.0
  - key: assume-role
    use: aws-cli
    call: aws/assume-role 1.0.0
    with:
      oidc-token: ${{ vaults.your-vault.oidc.your-token }}
      region: us-east-2
      role-to-assume: arn:aws:iam::your-account-id:role/your-role
```

To specify the length of the session:

```yaml
tasks:
  - key: aws-cli
    call: aws/install-cli 1.0.0
  - key: assume-role
    use: aws-cli
    call: aws/assume-role 1.0.0
    with:
      oidc-token: ${{ vaults.your-vault.oidc.your-token }}
      region: us-east-2
      role-to-assume: arn:aws:iam::your-account-id:role/your-role
      role-duration-seconds: 3600
```

To choose a name for the session:

```yaml
tasks:
  - key: aws-cli
    call: aws/install-cli 1.0.0
  - key: assume-role
    use: aws-cli
    call: aws/assume-role 1.0.0
    with:
      oidc-token: ${{ vaults.your-vault.oidc.your-token }}
      region: us-east-2
      role-to-assume: arn:aws:iam::your-account-id:role/your-role
      role-session-name: your-unique-session-name-${{ mint.run.id }}
```

To configure a specific profile:

```yaml
tasks:
  - key: aws-cli
    call: aws/install-cli 1.0.0
  - key: assume-role
    use: aws-cli
    call: aws/assume-role 1.0.0
    with:
      oidc-token: ${{ vaults.your-vault.oidc.your-token }}
      region: us-east-2
      role-to-assume: arn:aws:iam::your-account-id:role/your-role
      profile-name: your-profile
```
