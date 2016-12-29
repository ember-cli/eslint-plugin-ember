# eslint-plugin-netguru-ember

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-netguru-ember.svg?style=flat)](https://npmjs.org/package/eslint-plugin-netguru-ember)
[![NPM downloads](https://img.shields.io/npm/dm/eslint-plugin-netguru-ember.svg?style=flat)](https://npmjs.org/package/eslint-plugin-netguru-ember)
[![Circle CI](https://circleci.com/gh/netguru/eslint-plugin-netguru-ember.svg?style=svg&circle-token=58c1b942a91ecd67eed15502a5df51b3d1504f35)](https://circleci.com/gh/netguru/eslint-plugin-netguru-ember)

> ESlint plugin that provides set of rules for Ember Applications based on Netguru's Ember Styleguide.

## Summary

It's made to help you keep good practices mentioned in our [Ember Styleguide](https://github.com/netguru/ember-styleguide).

## Requirements

You need to have `ember-cli-eslint` installed in your app. [More info here](https://github.com/ember-cli/ember-cli-eslint).

## Usage

### 1. Install plugin

```shell
  npm install --save-dev eslint-plugin-netguru-ember
```

### 2. Modify `.eslintrc.js`:

#### Use with predefined settings:

```
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:netguru-ember/recommended'
  ],
  rules: {
    // override rules' settings here
  }
}
```

You can also use base configuration: `plugin:netguru-ember/base` which contains only settings for custom rules defined in this plugin.

#### Use plain plugin:

If you don't want to use predefined settings, you can use it as a plain plugin and choose which rules you'd like to you by yourself like this:

```
module.exports = {
  extends: [
    'eslint:recommended'
  ],
  plugins: [
    'netguru-ember'
  ],
  rules: {
    // add rules' settings here, eg.:
    'netguru-ember/local-modules': 2
  }
}
```

All rules from our plugin have to be prefixed with `netguru-ember/`

## Rules

* General
  * **local-modules** - Create local version of Ember.* and DS.* [(more)](https://github.com/netguru/ember-styleguide#create-local-version-of-ember-and-ds)
  * **no-observers** - Don't use observers [(more)](https://github.com/netguru/ember-styleguide#dont-use-observers)
  * **no-side-effect** - Don't introduce side-effects in computed properties [(more)](https://github.com/netguru/ember-styleguide#dont-introduce-side-effects-in-computed-properties)
  * **jquery-ember-run** - Don’t use jQuery without Ember Run Loop [(more)](https://github.com/netguru/ember-styleguide#dont-use-jquery-without-ember-run-loop)
  * **named-functions-in-promises** - Use named functions defined on objects to handle promises [(more)](https://github.com/netguru/ember-styleguide#use-named-functions-defined-on-objects-to-handle-promises)
  * **no-function-prototype-extensions** - Don't use Ember's function prototype extensions [(more)](https://github.com/netguru/ember-styleguide#do-not-use-embers-function-prototype-extensions)
  * **use-ember-get-and-set** - Use Ember get/set [(more)](https://github.com/netguru/ember-styleguide#use-emberget-and-emberset)
  * **use-brace-expansion** - Use brace expansion [(more)](https://github.com/netguru/ember-styleguide#use-brace-expansion)

* Organizing
  * **order-in-components** - Organize your components [(more)](https://github.com/netguru/ember-styleguide#organize-your-components)
  * **order-in-models** - Organize your models [(more)](https://github.com/netguru/ember-styleguide#organize-your-models)
  * **order-in-routes** - Organize your routes [(more)](https://github.com/netguru/ember-styleguide#organize-your-routes)
  * **order-in-controllers** - Organize your controllers [(more)](https://github.com/netguru/ember-styleguide#organize-your-controllers)

* Controllers
  * **alias-model-in-controller** - Alias your model [(more)](https://github.com/netguru/ember-styleguide#alias-your-model)
  * **query-params-on-top** - Query params should always be on top [(more)](https://github.com/netguru/ember-styleguide#query-params-should-always-be-on-top)

* Ember Data
  * **no-empty-attrs** - Be explicit with Ember data attribute types [(more)](https://github.com/netguru/ember-styleguide#be-explicit-with-ember-data-attribute-types)

* Components
  * **closure-actions** - Always use closure actions [(more)](https://github.com/netguru/ember-styleguide#closure-actions)
  * **no-on-calls-in-components** - Don't use .on() in components [(more)](https://github.com/netguru/ember-styleguide#dont-use-on-calls-as-components-values)
  * \* **avoid-leaking-state-in-components** - Don't use objects and arrays as default properties [(more)](https://github.com/netguru/ember-styleguide#avoid-leaking-state)

    Example config:
    ```
    netguru-ember/avoid-leaking-state-in-components: [1, ['array', 'of', 'ignored', 'properties']]
    ```


* Routing
  * **routes-segments-snake-case** - Route's dynamic segments should use snake case [(more)](https://github.com/netguru/ember-styleguide#route-naming)

\* Rule with optional settings

### All Rules in JSON

```
    "netguru-ember/alias-model-in-controller": 0,
    "netguru-ember/avoid-leaking-state-in-components": 0,
    "netguru-ember/closure-actions": 0,
    "netguru-ember/jquery-ember-run": 0,
    "netguru-ember/local-modules": 0,
    "netguru-ember/named-functions-in-promises": 0,
    "netguru-ember/no-empty-attrs": 0,
    "netguru-ember/no-function-prototype-extensions": 0,
    "netguru-ember/no-observers": 0,
    "netguru-ember/no-on-calls-in-components": 0,
    "netguru-ember/no-side-effects": 0,
    "netguru-ember/order-in-components": 0,
    "netguru-ember/order-in-controllers": 0,
    "netguru-ember/order-in-models": 0,
    "netguru-ember/order-in-routes": 0,
    "netguru-ember/query-params-on-top": 0,
    "netguru-ember/routes-segments-snake-case": 0,
    "netguru-ember/use-brace-expansion": 0,
    "netguru-ember/use-ember-get-and-set": 0,
```

## Contribution guide

TBD. For now feel free to add any suggestions in [issues](https://github.com/netguru/eslint-plugin-netguru-ember/issues). Any involvement highly appreciated.
