# google/install-chrome

You'll need to specify `chrome-version`. `chrome-version` can be one of:

- A Chrome release channel: `stable`, `beta`, `dev` or `canary`
- A Chrome version: `130`, `130.0.6669`, or `130.0.6669.0`.

Versions 115 and greater are supported.

## Without chromedriver

```yaml
tasks:
  - key: chrome
    call: google/install-chrome 1.0.1
    with:
      chrome-version: 130
```

## With a compatible chromedriver

```yaml
tasks:
  - key: chrome
    call: google/install-chrome 1.0.1
    with:
      chrome-version: 130
      install-chromedriver: true
```

## Installing multiple chromes

If you are installing multiple versions of chrome and using them within the same task, you'll need to choose where to install them and may want to exclude it from PATH (as the binary names will conflict). Some details about the chrome installation are exposed as output values:

```yaml
tasks:
  - key: chrome-129
    call: google/install-chrome 1.0.1
    with:
      chrome-version: 129
      install-chromedriver: true
      chrome-directory: /opt/chrome-129
      chromedriver-directory: /opt/chromedriver-129
      add-to-path: false

  - key: chrome-130
    call: google/install-chrome 1.0.1
    with:
      chrome-version: 130
      install-chromedriver: true
      chrome-directory: /opt/chrome-130
      chromedriver-directory: /opt/chromedriver-130
      add-to-path: false

  - key: use-chromes
    use: [chrome-130, chrome-129]
    run: |
      ${{ tasks.chrome-129.values.chrome-binary }} --version | grep "129\."
      ${{ tasks.chrome-129.values.chromedriver-binary }} --version | grep "129\."

      ${{ tasks.chrome-130.values.chrome-binary }} --version | grep "130\."
      ${{ tasks.chrome-130.values.chromedriver-binary }} --version | grep "130\."

      # or...

      /opt/chrome-129/chrome --version | grep "129\."
      /opt/chromedriver-129/chromedriver --version | grep "129\."

      /opt/chrome-130/chrome --version | grep "130\."
      /opt/chromedriver-130/chromedriver --version | grep "130\."
```

The following output values are available:

- `${{ tasks.chrome.values.chrome-version }}`
- `${{ tasks.chrome.values.chrome-binary }}`
- `${{ tasks.chrome.values.chrome-directory }}`
- `${{ tasks.chrome.values.chromedriver-binary }}`
- `${{ tasks.chrome.values.chromedriver-directory }}`

The `chromedriver.*` values are only available when chromedriver is installed.
