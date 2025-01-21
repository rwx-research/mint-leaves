# aws/assume-role

To assume a role:

```yaml
tasks:
  - key: aws-cli
    call: aws/install-cli 1.0.1

  - key: assume-role
    use: aws-cli
    call: aws/assume-role 1.1.4
    with:
      oidc-token: ${{ vaults.your-vault.oidc.your-token }}
      region: us-east-2
      role-to-assume: arn:aws:iam::your-account-id:role/your-role
```

To specify the length of the session:

```yaml
tasks:
  - key: aws-cli
    call: aws/install-cli 1.0.1

  - key: assume-role
    use: aws-cli
    call: aws/assume-role 1.1.4
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
    call: aws/install-cli 1.0.1

  - key: assume-role
    use: aws-cli
    call: aws/assume-role 1.1.4
    with:
      oidc-token: ${{ vaults.your-vault.oidc.your-token }}
      region: us-east-2
      role-to-assume: arn:aws:iam::your-account-id:role/your-role
      role-session-name: your-unique-session-name-${{ run.id }}
```

To configure a specific profile:

```yaml
tasks:
  - key: aws-cli
    call: aws/install-cli 1.0.1

  - key: assume-role
    use: aws-cli
    call: aws/assume-role 1.1.4
    with:
      oidc-token: ${{ vaults.your-vault.oidc.your-token }}
      region: us-east-2
      role-to-assume: arn:aws:iam::your-account-id:role/your-role
      profile-name: your-profile
```

To assume another role, via chaining:

```yaml
tasks:
  - key: aws-cli
    call: aws/install-cli 1.0.1

  - key: assume-role
    use: aws-cli
    call: aws/assume-role 1.1.4
    with:
      oidc-token: ${{ vaults.your-vault.oidc.your-token }}
      region: us-east-2
      role-to-assume: arn:aws:iam::your-account-id:role/your-role

  - key: chained-role
    use: assume-role
    call: aws/assume-role 1.1.4
    with:
      region: us-east-2
      role-to-assume: arn:aws:iam::your-account-id:role/your-other-role
```

To assume another role, via chaining, with specific profiles:

```yaml
tasks:
  - key: aws-cli
    call: aws/install-cli 1.0.1

  - key: assume-role
    use: aws-cli
    call: aws/assume-role 1.1.4
    with:
      oidc-token: ${{ vaults.your-vault.oidc.your-token }}
      region: us-east-2
      role-to-assume: arn:aws:iam::your-account-id:role/your-role
      profile-name: your-profile

  - key: chained-role
    use: assume-role
    call: aws/assume-role 1.1.4
    with:
      source-profile-name: your-profile
      region: us-east-2
      role-to-assume: arn:aws:iam::your-account-id:role/your-other-role
      profile-name: your-other-profile
```
