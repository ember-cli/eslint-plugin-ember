# eslint-plugin-netguru-ember

[![Circle CI](https://circleci.com/gh/netguru/eslint-plugin-netguru-ember.svg?style=svg&circle-token=58c1b942a91ecd67eed15502a5df51b3d1504f35)](https://circleci.com/gh/netguru/eslint-plugin-netguru-ember)

> ESlint plugin that provides set of rules for Ember Applications, that cover Netguru's Ember Styleguide

## Summary

It's made to help you keep good practices mentioned in our [Ember Styleguide](https://github.com/netguru/ember-styleguide)

## Usage

### With shareable config

The easiest way to use this plugin is through our [shareable config](https://github.com/netguru/eslint-config-netguru-ember). More about shareable configs [here](http://eslint.org/docs/developer-guide/shareable-configs.html).

In order to get it working follow these steps:

##### 1. Install all necessary dependencies:

  ```shell
    npm install --save-dev eslint ember-cli-eslint babel-eslint eslint-config-airbnb eslint-config-netguru-ember eslint-plugin-netguru-ember
  ```

##### Description

* ESlint core package
  ```shell
    npm install --save-dev eslint
  ```

* Ember Cli ESlint integration
  ```shell
    npm install --save-dev ember-cli-eslint
  ```

* Babel parser for ESlint
  ```shell
    npm install --save-dev babel-eslint
  ```

* Great config made by airbnb to keep their [JavaScript Styleguide](https://github.com/airbnb/javascript). We're extending it.
  ```shell
    npm install --save-dev eslint-config-airbnb
  ```

* Our config && plugin
  ```shell
    npm install --save-dev eslint-config-netguru-ember
  ```

  ```shell
    npm install --save-dev eslint-plugin-netguru-ember
  ```


##### 2. Change your `.eslintrc`, so it looks like this:

  ```shell
      extends: netguru-ember
  ```

### Without shareable config

##### 1. Install all necessary dependencies:

> npm install --save-dev eslint ember-cli-eslint babel-eslint eslint-plugin-netguru-ember

##### 2. Add plugin to your `.eslintrc`:

  ```shell
    plugins:
      - netguru-ember
  ```
##### 3. Configure rules in your `.eslintrc`:

  ```shell
    rules:
    - netguru-ember/local-modules: 1
  ```

All rules from our plugin have to be prefixed with `netguru-ember/`

## Rules

This is WIP, but we have already some rules written.

* General
  * **local-modules** - Create local version of Ember.* and DS.* [(more)](https://github.com/netguru/ember-styleguide#create-local-version-of-ember-and-ds)
  * **no-observers** - Don't use observers [(more)](https://github.com/netguru/ember-styleguide#dont-use-observers)
  * **no-side-effect** - Don't introduce side-effects in computed properties [(more)](https://github.com/netguru/ember-styleguide#dont-introduce-side-effects-in-computed-properties)
  * **jquery-ember-run** - Don’t use jQuery without Ember Run Loop [(more)](https://github.com/netguru/ember-styleguide#dont-use-jquery-without-ember-run-loop)
  * **named-functions-in-promises** - Use named functions defined on objects to handle promises [(more)](https://github.com/netguru/ember-styleguide#use-named-functions-defined-on-objects-to-handle-promises)

* Organizing
  * **order-in-objects** - Organize your components [(more)](https://github.com/netguru/ember-styleguide#organize-your-components)


## Contribution guide

TBD. For now feel free to add any suggestions in [issues](https://github.com/netguru/eslint-plugin-netguru-ember/issues). Any involvement highly appreciated.


