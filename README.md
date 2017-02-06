# eslint-plugin-ember

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-ember.svg?style=flat)](https://npmjs.org/package/eslint-plugin-ember)
[![NPM downloads](https://img.shields.io/npm/dm/eslint-plugin-ember.svg?style=flat)](https://npmjs.org/package/eslint-plugin-ember)
[![Build Status](https://travis-ci.org/netguru/eslint-plugin-ember.svg?branch=master)](https://travis-ci.org/netguru/eslint-plugin-ember)

> An ESlint plugin that provides set of rules for Ember Applications based on commonly known good practices.

## ❗️ Requirements

- [ESLint](http://eslint.org/) is required to use this plugin.
- Rules provided by this plugin should be runnable under latest stable, v4 LTS and v6 LTS Node.js versions.

## 🚀 Usage

### 1. Install plugin

```shell
  npm install --save-dev eslint-plugin-ember
```

### 2. Modify your `.eslintrc.js`:

#### Use with predefined settings:

```
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended'
  ],
  rules: {
    // override rules' settings here
  }
}
```

Possible configurations:
- [plugin:ember/base](https://github.com/netguru/eslint-plugin-ember/blob/master/config/base.js) - contains only recommended settings for custom rules defined in this plugin.
- [plugin:ember/recommended](https://github.com/netguru/eslint-plugin-ember/blob/master/config/recommended.js) - extends base configuration with extra rules' settings provided by eslint

#### Use plain plugin:

If you don't want to use predefined settings, you can use it as a plain plugin and choose which rules you'd like to use by yourself like this:

```
module.exports = {
  extends: [
    'eslint:recommended'
  ],
  plugins: [
    'ember'
  ],
  rules: {
    // add rules' settings here, eg.:
    'ember/local-modules': 2
  }
}
```

All rules from this plugin have to be prefixed with `ember/`

## 🍟 Rules

* General
  * **local-modules** - Create local version of Ember.* and DS.* [(more)](https://github.com/netguru/eslint-plugin-ember/blob/master/docs/RULES.md#create-local-version-of-ember-and-ds)
  * **no-observers** - Don't use observers [(more)](https://github.com/netguru/eslint-plugin-ember/blob/master/docs/RULES.md#dont-use-observers)
  * **no-side-effect** - Don't introduce side-effects in computed properties [(more)](https://github.com/netguru/eslint-plugin-ember/blob/master/docs/RULES.md#dont-introduce-side-effects-in-computed-properties)
  * **jquery-ember-run** - Don’t use jQuery without Ember Run Loop [(more)](https://github.com/netguru/eslint-plugin-ember/blob/master/docs/RULES.md#dont-use-jquery-without-ember-run-loop)
  * **named-functions-in-promises** - Use named functions defined on objects to handle promises [(more)](https://github.com/netguru/eslint-plugin-ember/blob/master/docs/RULES.md#use-named-functions-defined-on-objects-to-handle-promises)
  * **no-function-prototype-extensions** - Don't use Ember's function prototype extensions [(more)](https://github.com/netguru/eslint-plugin-ember/blob/master/docs/RULES.md#do-not-use-embers-function-prototype-extensions)
  * **use-ember-get-and-set** - Use Ember get/set [(more)](https://github.com/netguru/eslint-plugin-ember/blob/master/docs/RULES.md#use-emberget-and-emberset)
  * **use-brace-expansion** - Use brace expansion [(more)](https://github.com/netguru/eslint-plugin-ember/blob/master/docs/RULES.md#use-brace-expansion)

* Organizing
  * **order-in-components** - Organize your components [(more)](https://github.com/netguru/eslint-plugin-ember/blob/master/docs/RULES.md#organize-your-components)
  * **order-in-models** - Organize your models [(more)](https://github.com/netguru/eslint-plugin-ember/blob/master/docs/RULES.md#organize-your-models)
  * **order-in-routes** - Organize your routes [(more)](https://github.com/netguru/eslint-plugin-ember/blob/master/docs/RULES.md#organize-your-routes)
  * **order-in-controllers** - Organize your controllers [(more)](https://github.com/netguru/eslint-plugin-ember/blob/master/docs/RULES.md#organize-your-controllers)

* Controllers
  * **alias-model-in-controller** - Alias your model [(more)](https://github.com/netguru/eslint-plugin-ember/blob/master/docs/RULES.md#alias-your-model)
  * **query-params-on-top** - Query params should always be on top [(more)](https://github.com/netguru/eslint-plugin-ember/blob/master/docs/RULES.md#query-params-should-always-be-on-top)

* Ember Data
  * **no-empty-attrs** - Be explicit with Ember data attribute types [(more)](https://github.com/netguru/eslint-plugin-ember/blob/master/docs/RULES.md#be-explicit-with-ember-data-attribute-types)

* Components
  * **closure-actions** - Always use closure actions [(more)](https://github.com/netguru/eslint-plugin-ember/blob/master/docs/RULES.md#closure-actions)
  * **no-on-calls-in-components** - Don't use .on() in components [(more)](https://github.com/netguru/eslint-plugin-ember/blob/master/docs/RULES.md#dont-use-on-calls-as-components-values)
  * \* **avoid-leaking-state-in-components** - Don't use objects and arrays as default properties [(more)](https://github.com/netguru/eslint-plugin-ember/blob/master/docs/RULES.md#avoid-leaking-state)

    Example config:
    ```
    ember/avoid-leaking-state-in-components: [1, ['array', 'of', 'ignored', 'properties']]
    ```


* Routing
  * **routes-segments-snake-case** - Route's dynamic segments should use snake case [(more)](https://github.com/netguru/eslint-plugin-ember/#route-naming)

\* Rule with optional settings

### All Rules in JSON

```
"ember/alias-model-in-controller": 0,
"ember/avoid-leaking-state-in-components": 0,
"ember/closure-actions": 0,
"ember/jquery-ember-run": 0,
"ember/local-modules": 0,
"ember/named-functions-in-promises": 0,
"ember/no-empty-attrs": 0,
"ember/no-function-prototype-extensions": 0,
"ember/no-observers": 0,
"ember/no-on-calls-in-components": 0,
"ember/no-side-effects": 0,
"ember/order-in-components": 0,
"ember/order-in-controllers": 0,
"ember/order-in-models": 0,
"ember/order-in-routes": 0,
"ember/query-params-on-top": 0,
"ember/routes-segments-snake-case": 0,
"ember/use-brace-expansion": 0,
"ember/use-ember-get-and-set": 0,
```

## 🍻 Contribution guide

In order to add a new rule, you should:
- generate a new rule using the [official yeoman generator](https://github.com/eslint/generator-eslint)
- describe the rule in the generated `docs` file
- link to the new `docs` file in `docs/RULES.md`
- add the rule in [README.md](https://github.com/netguru/eslint-plugin-ember/blob/master/README.md#rules)

Recommended way of creating new rules:
- Create issue on GH with description of proposed rule
- Write sufficient test scenarios
- Run `yarn start`
- Implement logic for the new rule
- Make sure all tests are passing
- Add documentation and update README
- Create PR and link created issue in description

Please be aware that we're using `yarn` in this repository, so if you plan to add some dependencies - make sure you commit `yarn.lock` file too.

If you have any suggestions, ideas or problems feel free to add new [issue](https://github.com/netguru/eslint-plugin-ember/issues), but first please make sure your question does not repeat previous ones.

## ⭐️ Contributors
- [Michał Sajnóg](http://github.com/michalsnik)
- [Rafał Leszczyński](http://github.com/rafleszczynski)
- [Adrian Zalewski](http://github.com/bardzusny)
- [Kamil Ejsymont](http://github.com/netes)
- [Casey Watts](http://github.com/caseywatts)
- [Steve Gargan](http://github.com/sgargan)
- [Alex LaFroscia](http://github.com/alexlafroscia)
- [Tobias Bieniek](http://github.com/Turbo87)

##  🙌 Credits
- [DockYard team](http://github.com/DockYard) - for great inspiration with their [styleguide](https://github.com/DockYard/styleguides/blob/master/engineering/ember.md)
- [Rob Hilgefort](https://github.com/rjhilgefort) - for making it possible to redeploy new plugin under existing `eslint-plugin-ember` package name

## 🔓 License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).
