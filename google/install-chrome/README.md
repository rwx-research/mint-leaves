# google/install-chrome

You'll need to specify `chrome-version`. `chrome-version` can be one of:

- A Chrome release channel: `stable`, `beta`, `dev` or `canary`
- A Chrome version: `130`, `130.0.6669`, or `130.0.6669.0`.

Versions 115 and greater are supported.

## Without chromedriver

```yaml
tasks:
  - key: chrome
    call: google/install-chrome 2.0.0
    with:
      chrome-version: 130
```

## With a compatible chromedriver

```yaml
tasks:
  - key: chrome
    call: google/install-chrome 2.0.0
    with:
      chrome-version: 130
      install-chromedriver: true
```

## Installing multiple chromes

If you are installing multiple versions of chrome and using them within the same task, you'll need to choose where to install them and may want to exclude it from PATH (as the binary names will conflict). Some details about the chrome installation are exposed as output values:

```yaml
tasks:
  - key: chrome-129
    call: google/install-chrome 2.0.0
    with:
      chrome-version: 129
      install-chromedriver: true
      chrome-directory: /opt/chrome-129
      chromedriver-directory: /opt/chromedriver-129
      add-to-path: false

  - key: chrome-130
    call: google/install-chrome 2.0.0
    with:
      chrome-version: 130
      install-chromedriver: true
      chrome-directory: /opt/chrome-130
      chromedriver-directory: /opt/chromedriver-130
      add-to-path: false

  - key: use-chromes
    use: [chrome-130, chrome-129]
    run: |
      /opt/chrome-129/chrome --version | grep "129\."
      /opt/chromedriver-129/chromedriver --version | grep "129\."

      /opt/chrome-130/chrome --version | grep "130\."
      /opt/chromedriver-130/chromedriver --version | grep "130\."
```

# Using headless Chrome

By default, `google/install-chrome` supports tools that interact with Chrome in headless mode. Here's an example with Selenium and Ruby:

```yml
- key: chrome
  call: google/install-chrome 2.0.0
  with:
    chrome-version: stable
    install-chromedriver: true

- key: ruby
  call: mint/install-ruby 2.0.0
  with:
    ruby-version: 3.3.4

- key: selenium-example
  use: [chrome, ruby]
  run: |
    cat << EOF > Gemfile
    source "https://rubygems.org"

    gem "selenium-webdriver", "~> 4.24"
    EOF

    cat << EOF > selenium.rb
    require "selenium-webdriver"

    Selenium::WebDriver.logger.level = :debug
    Selenium::WebDriver.logger.output = 'selenium.log'

    options = Selenium::WebDriver::Options.chrome(args: ['--headless=new'])
    driver = Selenium::WebDriver.for(:chrome, options:)
    driver.navigate.to "http://google.com"

    element = driver.find_element(name: 'q')
    element.send_keys "Hello WebDriver!"
    element.submit

    puts driver.title

    driver.quit
    EOF

    bundle install

    ruby selenium.rb | grep "Hello WebDriver! - Google Search"
    cat selenium.log
```

# Using headed Chrome

You can also use tools that interact with headed Chrome. To do so, you'll need to add a background process to the task that's using Chrome. Here's an example with Selenium and Ruby:

```yml
- key: chrome
  call: google/install-chrome 2.0.0
  with:
    chrome-version: stable
    install-chromedriver: true

- key: ruby
  call: mint/install-ruby 2.0.0
  with:
    ruby-version: 3.3.4

- key: selenium-example
  use: [chrome, ruby]
  background-processes:
    - key: chrome-virtual-display
      run: start-chrome-virtual-display
      ready-check: is-chrome-virtual-display-running
  run: |
    cat << EOF > Gemfile
    source "https://rubygems.org"

    gem "selenium-webdriver", "~> 4.24"
    EOF

    cat << EOF > selenium.rb
    require "selenium-webdriver"

    Selenium::WebDriver.logger.level = :debug
    Selenium::WebDriver.logger.output = 'selenium.log'

    options = Selenium::WebDriver::Options.chrome(args: [])
    driver = Selenium::WebDriver.for(:chrome, options:)
    driver.navigate.to "http://google.com"

    element = driver.find_element(name: 'q')
    element.send_keys "Hello WebDriver!"
    element.submit

    puts driver.title

    driver.quit
    EOF

    bundle install

    ruby selenium.rb | grep "Hello WebDriver! - Google Search"
    cat selenium.log
```

Take note of the background process that's using `start-chrome-virtual-display` and `is-chrome-virtual-display-running`. These are two additional executables we provide to make headed Chrome usage easier. They are within the `chrome-directory`, so by default they'll be in PATH. These small programs start a virtual display that Chrome can interact with.

`start-chrome-virtual-display` accepts two arguments, optionally:

- `start-chrome-virtual-display 1280x1024` sets the resolution to 1280x1024
- `start-chrome-virtual-display 1280x1024 24` sets the resolution to 1280x1024 and the bit depth to 24

By default, `start-chrome-virtual-display` will provide a virtual display with a resolution of 1280x1024 and bit depth of 24.
