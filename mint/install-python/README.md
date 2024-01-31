# mint/install-python

You'll need to specify `python-version`

```yaml
tasks:
  - key: python
    call: mint/install-python 1.0.2
    with:
      python-version: 3.12.1
```

Currently, only Python versions 3.7 and higher are supported.
