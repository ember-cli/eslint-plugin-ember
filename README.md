# eslint-plugin-netguru-ember

[![Circle CI](https://circleci.com/gh/netguru/eslint-plugin-netguru-ember.svg?style=svg&circle-token=58c1b942a91ecd67eed15502a5df51b3d1504f35)](https://circleci.com/gh/netguru/eslint-plugin-netguru-ember)

> ESlint plugin that provides set of rules for Ember Applications, that cover Netguru's Ember Styleguide

## Summary

It's made to help you keep good practices mentioned in our [Ember Styleguide](https://github.com/netguru/ember-styleguide)

## Usage

### With shareable config

The easiest way to use this plugin is through our [shareable config](https://github.com/netguru/eslint-config-netguru-ember). More about shareable configs [here](http://eslint.org/docs/developer-guide/shareable-configs.html).

##### 1. Install all necessary dependencies:

  ```shell
    npm install --save-dev eslint-config-netguru-ember eslint
  ```

##### 2. Change your `.eslintrc`, so it looks like this:

  ```shell
      extends: netguru-ember
  ```

### Without shareable config

##### 1. Install all necessary dependencies:

  ```shell
    npm install --save-dev eslint-plugin-netguru-ember eslint
  ```

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
  * **order-in-components** - Organize your components [(more)](https://github.com/netguru/ember-styleguide#organize-your-components)
  * **order-in-models** - Organize your models [(more)](https://github.com/netguru/ember-styleguide#organize-your-models)

* Controllers
  * **alias-model-in-controller** - Alias your model [(more)](https://github.com/netguru/ember-styleguide#alias-your-model)
  * **query-params-on-top** - Query params should always be on top [(more)](https://github.com/netguru/ember-styleguide#query-params-should-always-be-on-top)

* Ember Data
  * **no-empty-attrs** - Be explicit with Ember data attribute types [(more)](https://github.com/netguru/ember-styleguide#be-explicit-with-ember-data-attribute-types)

* Components
  * **closure-actions** - Always use closure actions [(more)](https://github.com/netguru/ember-styleguide#closure-actions)

## Contribution guide

TBD. For now feel free to add any suggestions in [issues](https://github.com/netguru/eslint-plugin-netguru-ember/issues). Any involvement highly appreciated.


