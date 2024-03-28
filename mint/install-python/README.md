# mint/install-python

We currently support Python versions 3.7.0 through 3.12.2. You'll need to specify `python-version`.

```yaml
tasks:
  - key: python
    call: mint/install-python 1.0.5
    with:
      python-version: 3.12.2
```
