# eslint-plugin-ember

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-ember.svg?style=flat)](https://npmjs.org/package/eslint-plugin-ember)
[![NPM downloads](https://img.shields.io/npm/dm/eslint-plugin-ember.svg?style=flat)](https://npmjs.org/package/eslint-plugin-ember)
[![Build Status](https://travis-ci.org/ember-cli/eslint-plugin-ember.svg?branch=master)](https://travis-ci.org/ember-cli/eslint-plugin-ember)

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

```javascript
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
- [plugin:ember/base](https://github.com/ember-cli/eslint-plugin-ember/blob/master/lib/config/base.js) - contains only recommended settings for custom rules defined in this plugin.
- [plugin:ember/recommended](https://github.com/ember-cli/eslint-plugin-ember/blob/master/lib/config/recommended.js) - extends base configuration with extra rules' settings provided by eslint

#### Use plain plugin:

If you don't want to use predefined settings, you can use it as a plain plugin and choose which rules you'd like to use by yourself like this:

```javascript
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

Rules are grouped by category to help you understand their purpose.

All rules below with a check mark :white_check_mark: are enabled by default while using `plugin:ember/base` or `plugin:ember/recommended` configs.

The `--fix` option on the command line automatically fixes problems reported by rules which have a wrench :wrench: below.

<!--RULES_TABLE_START-->

### Controllers

|    | Rule ID | Description |
|:---|:--------|:------------|
| :white_check_mark: | [alias-model-in-controller](./docs/rules/alias-model-in-controller.md) | Enforces aliasing model in controller |


### Components

|    | Rule ID | Description |
|:---|:--------|:------------|
| :white_check_mark: | [avoid-leaking-state-in-components](./docs/rules/avoid-leaking-state-in-components.md) | Avoids state leakage |
| :white_check_mark: | [closure-actions](./docs/rules/closure-actions.md) | Enforces usage of closure actions |
| :white_check_mark: | [no-attrs-snapshot](./docs/rules/no-attrs-snapshot.md) | Disallow use of attrs snapshot in `didReceiveAttrs` and `didUpdateAttrs` |
| :white_check_mark: | [no-on-calls-in-components](./docs/rules/no-on-calls-in-components.md) | Prevents usage of `on` calls in components |


### General

|    | Rule ID | Description |
|:---|:--------|:------------|
| :white_check_mark: | [jquery-ember-run](./docs/rules/jquery-ember-run.md) | Prevents usage of jQuery without Ember Run Loop |
|  | [local-modules](./docs/rules/local-modules.md) | Enforces usage of local modules |
| :white_check_mark: | [named-functions-in-promises](./docs/rules/named-functions-in-promises.md) | Enforces usage of named functions in promises |
|  | [new-module-imports](./docs/rules/new-module-imports.md) |  Use "New Module Imports" from Ember RFC #176 |
|  | [no-attrs-in-components](./docs/rules/no-attrs-in-components.md) | Disallow usage of this.attrs in components |
|  | [no-duplicate-dependent-keys](./docs/rules/no-duplicate-dependent-keys.md) | Disallow repeating dependent keys |
| :white_check_mark: | [no-function-prototype-extensions](./docs/rules/no-function-prototype-extensions.md) | Prevents usage of Ember's `function` prototype extensions |
|  | [no-global-jquery](./docs/rules/no-global-jquery.md) | Prevents usage of global jQuery object |
| :white_check_mark: | [no-observers](./docs/rules/no-observers.md) | Prevents usage of observers |
| :wrench: | [no-old-shims](./docs/rules/no-old-shims.md) | Prevents usage of old shims for modules |
| :white_check_mark: | [no-side-effects](./docs/rules/no-side-effects.md) | Warns about unexpected side effects in computed properties |
|  | [require-super-in-init](./docs/rules/require-super-in-init.md) | Enforces super calls in init hooks |
| :white_check_mark: | [use-brace-expansion](./docs/rules/use-brace-expansion.md) | Enforces usage of brace expansion |
| :white_check_mark::wrench: | [use-ember-get-and-set](./docs/rules/use-ember-get-and-set.md) | Enforces usage of Ember.get and Ember.set |


### Routing

|    | Rule ID | Description |
|:---|:--------|:------------|
| :white_check_mark: | [no-capital-letters-in-routes](./docs/rules/no-capital-letters-in-routes.md) | Raise an error when there is a route with uppercased letters in router.js |
| :white_check_mark: | [routes-segments-snake-case](./docs/rules/routes-segments-snake-case.md) | Enforces usage of snake_cased dynamic segments in routes |


### Ember Data

|    | Rule ID | Description |
|:---|:--------|:------------|
| :white_check_mark: | [no-empty-attrs](./docs/rules/no-empty-attrs.md) | Prevents usage of empty attributes in ember data models |


### Components & tests

|    | Rule ID | Description |
|:---|:--------|:------------|
|  | [no-jquery](./docs/rules/no-jquery.md) | Disallow any usage of jQuery |


### Organizing

|    | Rule ID | Description |
|:---|:--------|:------------|
| :white_check_mark: | [order-in-components](./docs/rules/order-in-components.md) | Enforces proper order of properties in components |
| :white_check_mark: | [order-in-controllers](./docs/rules/order-in-controllers.md) | Enforces proper order of properties in controllers |
| :white_check_mark: | [order-in-models](./docs/rules/order-in-models.md) | Enforces proper order of properties in models |
| :white_check_mark: | [order-in-routes](./docs/rules/order-in-routes.md) | Enforces proper order of properties in routes |

<!--RULES_TABLE_END-->

For the simplified list of rules, [go here](./lib/recommended-rules.js).

## 🍻 Contribution guide

In order to add a new rule, you should:
- Create issue on GH with description of proposed rule
- Generate a new rule using the [official yeoman generator](https://github.com/eslint/generator-eslint)
- Run `yarn start`
- Write test scenarios & implement logic
- Describe the rule in the generated `docs` file
- Make sure all tests are passing
- Run `yarn run update` in order to update readme and recommended configuration
- Create PR and link created issue in description

Please be aware that we're using `yarn` in this repository, so if you plan to add some dependencies - make sure you commit `yarn.lock` file too.

If you have any suggestions, ideas or problems feel free to add new [issue](https://github.com/ember-cli/eslint-plugin-ember/issues), but first please make sure your question does not repeat previous ones.

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
