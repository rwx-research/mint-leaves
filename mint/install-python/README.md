# mint/install-python

Mint currently supports Python versions 3.7.0 through 3.13.1. You'll need to specify `python-version`.

```yaml
tasks:
  - key: python
    call: mint/install-python 1.2.2
    with:
      python-version: 3.13.1
```

You can optionally specify the version of `pip` to install:

```yaml
tasks:
  - key: python
    call: mint/install-python 1.2.2
    with:
      python-version: 3.13.1
      pip-version: 24.1
```

And the version of `setuptools`:

```yaml
tasks:
  - key: python
    call: mint/install-python 1.2.2
    with:
      python-version: 3.13.1
      pip-version: 24.1
      setuptools-version: 72.1.0
```

If you do not specify `pip-version` or `setuptools-version`, the versions that shipped with the respective versions of python will be installed.
NOTE: Python versions 3.12.0 and greater do not install `setuptools` by default. See [docker-library/python#952](https://github.com/docker-library/python/issues/952) for more information on this decision. If you would like to install setuptools via this leaf, pass the `setuptools-version` parameter.
