# mint/install-python

Mint currently supports Python versions 3.7.0 through 3.12.4. You'll need to specify `python-version`.

```yaml
tasks:
  - key: python
    call: mint/install-python 1.1.0
    with:
      python-version: 3.12.4
```

You can optionally specify the version of `pip` to install:


```yaml
tasks:
  - key: python
    call: mint/install-python 1.1.0
    with:
      python-version: 3.12.4
      pip-version: 24.2
```

And the version of `setuptools`:

```yaml
tasks:
  - key: python
    call: mint/install-python 1.1.0
    with:
      python-version: 3.12.4
      pip-version: 24.2
      setuptools-version: 72.1.0
```

If you do not specify `pip-version` or `setuptools-version`, the versions that shipped with the respective versions of python will be installed.
