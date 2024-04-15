# mint/install-python

Mint currently supports Python versions 3.7.0 through 3.12.3. You'll need to specify `python-version`.

```yaml
tasks:
  - key: python
    call: mint/install-python 1.0.7
    with:
      python-version: 3.12.3
```
