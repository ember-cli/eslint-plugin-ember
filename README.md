# eslint-plugin-ember

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-ember.svg?style=flat)](https://npmjs.org/package/eslint-plugin-ember)
[![NPM downloads](https://img.shields.io/npm/dm/eslint-plugin-ember.svg?style=flat)](https://npmjs.org/package/eslint-plugin-ember)
![CI](https://github.com/ember-cli/eslint-plugin-ember/workflows/CI/badge.svg)

> An ESLint plugin that provides a set of rules for Ember applications based on commonly known good practices.

## ❗️Requirements

- [ESLint](https://eslint.org/) `>= 7`
- [Node.js](https://nodejs.org/) `14.* || 16.* || >= 18`

## 🚀 Usage

### 1. Install plugin

```shell
yarn add --dev eslint-plugin-ember
```

Or

```shell
npm install --save-dev eslint-plugin-ember
```

### 2. Modify your `.eslintrc.js`

```js
// .eslintrc.js
module.exports = {
  plugins: ['ember'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended' // or other configuration
  ],
  rules: {
    // override / enable optional rules
    'ember/no-replace-test-comments': 'error'
  }
};
```

## 🧰 Configurations

|    | Name | Description |
|:---|:-----|:------------|
| ✅ | [recommended](./lib/recommended-rules.js) | enables the `recommended` rules |

## 🍟 Rules
<!-- begin auto-generated rules list -->

✅ Enabled in the `recommended` [configuration](https://github.com/ember-cli/eslint-plugin-ember#-configurations).\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

### Components

| Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description                                                                                                                          | ✅  | 🔧  | 💡  |
| :--------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- | :-- | :-- | :-- |
| [no-attrs-in-components](docs/rules/no-attrs-in-components.md)                                                                                       | disallow usage of `this.attrs` in components                                                                                         | ✅  |     |     |
| [no-attrs-snapshot](docs/rules/no-attrs-snapshot.md)                                                                                                 | disallow use of attrs snapshot in the `didReceiveAttrs` and `didUpdateAttrs` component hooks                                         | ✅  |     |     |
| [no-classic-components](docs/rules/no-classic-components.md)                                                                                         | enforce using Glimmer components                                                                                                     | ✅  |     |     |
| [no-component-lifecycle-hooks](docs/rules/no-component-lifecycle-hooks.md)                                                                           | disallow usage of "classic" ember component lifecycle hooks. Render modifiers or custom functional modifiers should be used instead. | ✅  |     |     |
| [no-on-calls-in-components](docs/rules/no-on-calls-in-components.md)                                                                                 | disallow usage of `on` to call lifecycle hooks in components                                                                         | ✅  |     |     |
| [require-tagless-components](docs/rules/require-tagless-components.md)                                                                               | disallow using the wrapper element of a component                                                                                    | ✅  |     |     |

### Computed Properties

| Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description                                                                                 | ✅  | 🔧  | 💡  |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------ | :-- | :-- | :-- |
| [computed-property-getters](docs/rules/computed-property-getters.md)                                                                                                                                                                                                                                                                                                   | enforce the consistent use of getters in computed properties                                |     |     |     |
| [no-arrow-function-computed-properties](docs/rules/no-arrow-function-computed-properties.md)                                                                                                                                                                                                                                                                           | disallow arrow functions in computed properties                                             | ✅  |     |     |
| [no-assignment-of-untracked-properties-used-in-tracking-contexts](docs/rules/no-assignment-of-untracked-properties-used-in-tracking-contexts.md)                                                                                                                                                                                                                       | disallow assignment of untracked properties that are used as computed property dependencies | ✅  | 🔧  |     |
| [no-computed-properties-in-native-classes](docs/rules/no-computed-properties-in-native-classes.md)                                                                                                                                                                                                                                                                     | disallow using computed properties in native classes                                        | ✅  |     |     |
| [no-deeply-nested-dependent-keys-with-each](docs/rules/no-deeply-nested-dependent-keys-with-each.md)                                                                                                                                                                                                                                                                   | disallow usage of deeply-nested computed property dependent keys with `@each`               | ✅  |     |     |
| [no-duplicate-dependent-keys](docs/rules/no-duplicate-dependent-keys.md)                                                                                                                                                                                                                                                                                               | disallow repeating computed property dependent keys                                         | ✅  | 🔧  |     |
| [no-incorrect-computed-macros](docs/rules/no-incorrect-computed-macros.md)                                                                                                                                                                                                                                                                                             | disallow incorrect usage of computed property macros                                        | ✅  | 🔧  |     |
| [no-invalid-dependent-keys](docs/rules/no-invalid-dependent-keys.md)                                                                                                                                                                                                                                                                                                   | disallow invalid dependent keys in computed properties                                      | ✅  | 🔧  |     |
| [no-side-effects](docs/rules/no-side-effects.md)                                                                                                                                                                                                                                                                                                                       | disallow unexpected side effects in computed properties                                     | ✅  |     |     |
| [no-volatile-computed-properties](docs/rules/no-volatile-computed-properties.md)                                                                                                                                                                                                                                                                                       | disallow volatile computed properties                                                       | ✅  |     |     |
| [require-computed-macros](docs/rules/require-computed-macros.md)                                                                                                                                                                                                                                                                                                       | require using computed property macros when possible                                        | ✅  | 🔧  |     |
| [require-computed-property-dependencies](docs/rules/require-computed-property-dependencies.md)                                                                                                                                                                                                                                                                         | require dependencies to be declared statically in computed properties                       | ✅  | 🔧  |     |
| [require-return-from-computed](docs/rules/require-return-from-computed.md)                                                                                                                                                                                                                                                                                             | disallow missing return statements in computed properties                                   | ✅  |     |     |
| [use-brace-expansion](docs/rules/use-brace-expansion.md)                                                                                                                                                                                                                                                                                                               | enforce usage of brace expansion in computed property dependent keys                        | ✅  |     |     |

### Controllers

| Name                                                                               | Description                           | ✅  | 🔧  | 💡  |
| :--------------------------------------------------------------------------------- | :------------------------------------ | :-- | :-- | :-- |
| [alias-model-in-controller](docs/rules/alias-model-in-controller.md)               | enforce aliasing model in controllers |     |     |     |
| [avoid-using-needs-in-controllers](docs/rules/avoid-using-needs-in-controllers.md) | disallow using `needs` in controllers | ✅  |     |     |
| [no-controllers](docs/rules/no-controllers.md)                                     | disallow non-essential controllers    |     |     |     |

### Deprecations

| Name                                                                               | Description                                               | ✅  | 🔧  | 💡  |
| :--------------------------------------------------------------------------------- | :-------------------------------------------------------- | :-- | :-- | :-- |
| [closure-actions](docs/rules/closure-actions.md)                                   | enforce usage of closure actions                          | ✅  |     |     |
| [new-module-imports](docs/rules/new-module-imports.md)                             | enforce using "New Module Imports" from Ember RFC #176    | ✅  |     |     |
| [no-array-prototype-extensions](docs/rules/no-array-prototype-extensions.md)       | disallow usage of Ember's `Array` prototype extensions    |     | 🔧  |     |
| [no-function-prototype-extensions](docs/rules/no-function-prototype-extensions.md) | disallow usage of Ember's `function` prototype extensions | ✅  |     |     |
| [no-mixins](docs/rules/no-mixins.md)                                               | disallow the usage of mixins                              | ✅  |     |     |
| [no-new-mixins](docs/rules/no-new-mixins.md)                                       | disallow the creation of new mixins                       | ✅  |     |     |
| [no-observers](docs/rules/no-observers.md)                                         | disallow usage of observers                               | ✅  |     |     |
| [no-old-shims](docs/rules/no-old-shims.md)                                         | disallow usage of old shims for modules                   | ✅  | 🔧  |     |
| [no-string-prototype-extensions](docs/rules/no-string-prototype-extensions.md)     | disallow usage of `String` prototype extensions           | ✅  |     |     |

### Ember Data

| Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description                                                          | ✅  | 🔧  | 💡  |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------- | :-- | :-- | :-- |
| [no-empty-attrs](docs/rules/no-empty-attrs.md)                                                                                                                   | disallow usage of empty attributes in Ember Data models              |     |     |     |
| [use-ember-data-rfc-395-imports](docs/rules/use-ember-data-rfc-395-imports.md)                                                                                   | enforce usage of `@ember-data/` package imports instead `ember-data` | ✅  | 🔧  |     |

### Ember Object

| Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description                                                                    | ✅  | 🔧  | 💡  |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------- | :-- | :-- | :-- |
| [avoid-leaking-state-in-ember-objects](docs/rules/avoid-leaking-state-in-ember-objects.md)                                                                                                           | disallow state leakage                                                         | ✅  |     |     |
| [no-get](docs/rules/no-get.md)                                                                                                                                                                       | require using ES5 getters instead of Ember's `get` / `getProperties` functions | ✅  | 🔧  |     |
| [no-get-with-default](docs/rules/no-get-with-default.md)                                                                                                                                             | disallow usage of the Ember's `getWithDefault` function                        | ✅  | 🔧  |     |
| [no-proxies](docs/rules/no-proxies.md)                                                                                                                                                               | disallow using array or object proxies                                         |     |     |     |
| [no-try-invoke](docs/rules/no-try-invoke.md)                                                                                                                                                         | disallow usage of the Ember's `tryInvoke` util                                 | ✅  |     |     |
| [require-super-in-lifecycle-hooks](docs/rules/require-super-in-lifecycle-hooks.md)                                                                                                                   | require super to be called in lifecycle hooks                                  | ✅  | 🔧  |     |
| [use-ember-get-and-set](docs/rules/use-ember-get-and-set.md)                                                                                                                                         | enforce usage of `Ember.get` and `Ember.set`                                   |     | 🔧  |     |

### Ember Octane

| Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description                                                                                                    | ✅  | 🔧  | 💡  |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------- | :-- | :-- | :-- |
| [classic-decorator-hooks](docs/rules/classic-decorator-hooks.md)                                                                                                                                     | enforce using correct hooks for both classic and non-classic classes                                           | ✅  |     |     |
| [classic-decorator-no-classic-methods](docs/rules/classic-decorator-no-classic-methods.md)                                                                                                           | disallow usage of classic APIs such as `get`/`set` in classes that aren't explicitly decorated with `@classic` | ✅  |     |     |
| [no-actions-hash](docs/rules/no-actions-hash.md)                                                                                                                                                     | disallow the actions hash in components, controllers, and routes                                               | ✅  |     |     |
| [no-classic-classes](docs/rules/no-classic-classes.md)                                                                                                                                               | disallow "classic" classes in favor of native JS classes                                                       | ✅  |     |     |
| [no-ember-super-in-es-classes](docs/rules/no-ember-super-in-es-classes.md)                                                                                                                           | disallow use of `this._super` in ES class methods                                                              | ✅  | 🔧  |     |
| [no-empty-glimmer-component-classes](docs/rules/no-empty-glimmer-component-classes.md)                                                                                                               | disallow empty backing classes for Glimmer components                                                          | ✅  |     |     |

### jQuery

| Name                                               | Description                                        | ✅  | 🔧  | 💡  |
| :------------------------------------------------- | :------------------------------------------------- | :-- | :-- | :-- |
| [jquery-ember-run](docs/rules/jquery-ember-run.md) | disallow usage of jQuery without an Ember run loop | ✅  |     |     |
| [no-global-jquery](docs/rules/no-global-jquery.md) | disallow usage of global jQuery object             | ✅  |     |     |
| [no-jquery](docs/rules/no-jquery.md)               | disallow any usage of jQuery                       | ✅  |     |     |

### Miscellaneous

| Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description                                                                                                                   | ✅  | 🔧  | 💡  |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------- | :-- | :-- | :-- |
| [named-functions-in-promises](docs/rules/named-functions-in-promises.md)                                                                                                                                                                                                                 | enforce usage of named functions in promises                                                                                  |     |     |     |
| [no-html-safe](docs/rules/no-html-safe.md)                                                                                                                                                                                                                                               | disallow the use of `htmlSafe`                                                                                                |     |     |     |
| [no-incorrect-calls-with-inline-anonymous-functions](docs/rules/no-incorrect-calls-with-inline-anonymous-functions.md)                                                                                                                                                                   | disallow inline anonymous functions as arguments to `debounce`, `once`, and `scheduleOnce`                                    | ✅  |     |     |
| [no-invalid-debug-function-arguments](docs/rules/no-invalid-debug-function-arguments.md)                                                                                                                                                                                                 | disallow usages of Ember's `assert()` / `warn()` / `deprecate()` functions that have the arguments passed in the wrong order. | ✅  |     |     |
| [no-restricted-property-modifications](docs/rules/no-restricted-property-modifications.md)                                                                                                                                                                                               | disallow modifying the specified properties                                                                                   |     | 🔧  |     |
| [require-fetch-import](docs/rules/require-fetch-import.md)                                                                                                                                                                                                                               | enforce explicit import for `fetch()`                                                                                         |     |     |     |

### Routes

| Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description                                                                              | ✅  | 🔧  | 💡  |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------- | :-- | :-- | :-- |
| [no-capital-letters-in-routes](docs/rules/no-capital-letters-in-routes.md)                                                                                                   | disallow routes with uppercased letters in router.js                                     | ✅  |     |     |
| [no-controller-access-in-routes](docs/rules/no-controller-access-in-routes.md)                                                                                               | disallow routes from accessing the controller outside of setupController/resetController | ✅  |     |     |
| [no-private-routing-service](docs/rules/no-private-routing-service.md)                                                                                                       | disallow injecting the private routing service                                           | ✅  |     |     |
| [no-shadow-route-definition](docs/rules/no-shadow-route-definition.md)                                                                                                       | enforce no route path definition shadowing                                               | ✅  |     |     |
| [no-unnecessary-index-route](docs/rules/no-unnecessary-index-route.md)                                                                                                       | disallow unnecessary `index` route definition                                            |     |     |     |
| [no-unnecessary-route-path-option](docs/rules/no-unnecessary-route-path-option.md)                                                                                           | disallow unnecessary usage of the route `path` option                                    | ✅  | 🔧  |     |
| [route-path-style](docs/rules/route-path-style.md)                                                                                                                           | enforce usage of kebab-case (instead of snake_case or camelCase) in route paths          |     |     | 💡  |
| [routes-segments-snake-case](docs/rules/routes-segments-snake-case.md)                                                                                                       | enforce usage of snake_cased dynamic segments in routes                                  | ✅  |     |     |

### Services

| Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description                                                       | ✅  | 🔧  | 💡  |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------- | :-- | :-- | :-- |
| [no-implicit-service-injection-argument](docs/rules/no-implicit-service-injection-argument.md)                                                                                                                                     | disallow omitting the injected service name argument              |     | 🔧  |     |
| [no-restricted-service-injections](docs/rules/no-restricted-service-injections.md)                                                                                                                                                 | disallow injecting certain services under certain paths           |     |     |     |
| [no-unnecessary-service-injection-argument](docs/rules/no-unnecessary-service-injection-argument.md)                                                                                                                               | disallow unnecessary argument when injecting services             |     | 🔧  |     |
| [no-unused-services](docs/rules/no-unused-services.md)                                                                                                                                                                             | disallow unused service injections (see rule doc for limitations) |     |     | 💡  |

### Stylistic Issues

| Name                                                       | Description                                       | ✅  | 🔧  | 💡  |
| :--------------------------------------------------------- | :------------------------------------------------ | :-- | :-- | :-- |
| [order-in-components](docs/rules/order-in-components.md)   | enforce proper order of properties in components  |     | 🔧  |     |
| [order-in-controllers](docs/rules/order-in-controllers.md) | enforce proper order of properties in controllers |     | 🔧  |     |
| [order-in-models](docs/rules/order-in-models.md)           | enforce proper order of properties in models      |     | 🔧  |     |
| [order-in-routes](docs/rules/order-in-routes.md)           | enforce proper order of properties in routes      |     | 🔧  |     |

### Testing

| Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description                                                                                              | ✅  | 🔧  | 💡  |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------- | :-- | :-- | :-- |
| [no-current-route-name](docs/rules/no-current-route-name.md)                                                                                                                                                                             | disallow usage of the `currentRouteName()` test helper                                                   |     |     |     |
| [no-ember-testing-in-module-scope](docs/rules/no-ember-testing-in-module-scope.md)                                                                                                                                                       | disallow use of `Ember.testing` in module scope                                                          | ✅  |     |     |
| [no-invalid-test-waiters](docs/rules/no-invalid-test-waiters.md)                                                                                                                                                                         | disallow incorrect usage of test waiter APIs                                                             | ✅  |     |     |
| [no-legacy-test-waiters](docs/rules/no-legacy-test-waiters.md)                                                                                                                                                                           | disallow the use of the legacy test waiter APIs                                                          | ✅  |     |     |
| [no-noop-setup-on-error-in-before](docs/rules/no-noop-setup-on-error-in-before.md)                                                                                                                                                       | disallows using no-op setupOnerror in `before` or `beforeEach`                                           | ✅  | 🔧  |     |
| [no-pause-test](docs/rules/no-pause-test.md)                                                                                                                                                                                             | disallow usage of the `pauseTest` helper in tests                                                        | ✅  |     |     |
| [no-replace-test-comments](docs/rules/no-replace-test-comments.md)                                                                                                                                                                       | disallow 'Replace this with your real tests' comments in test files                                      |     |     |     |
| [no-restricted-resolver-tests](docs/rules/no-restricted-resolver-tests.md)                                                                                                                                                               | disallow the use of patterns that use the restricted resolver in tests                                   | ✅  |     |     |
| [no-settled-after-test-helper](docs/rules/no-settled-after-test-helper.md)                                                                                                                                                               | disallow usage of `await settled()` right after test helper that calls it internally                     | ✅  | 🔧  |     |
| [no-test-and-then](docs/rules/no-test-and-then.md)                                                                                                                                                                                       | disallow usage of the `andThen` test wait helper                                                         | ✅  |     |     |
| [no-test-import-export](docs/rules/no-test-import-export.md)                                                                                                                                                                             | disallow importing of "-test.js" in a test file and exporting from a test file                           | ✅  |     |     |
| [no-test-module-for](docs/rules/no-test-module-for.md)                                                                                                                                                                                   | disallow usage of `moduleFor`, `moduleForComponent`, etc                                                 | ✅  |     |     |
| [no-test-support-import](docs/rules/no-test-support-import.md)                                                                                                                                                                           | disallow importing of "test-support" files in production code.                                           | ✅  |     |     |
| [no-test-this-render](docs/rules/no-test-this-render.md)                                                                                                                                                                                 | disallow usage of the `this.render` in tests, recommending to use @ember/test-helpers' `render` instead. | ✅  |     |     |
| [prefer-ember-test-helpers](docs/rules/prefer-ember-test-helpers.md)                                                                                                                                                                     | enforce usage of `@ember/test-helpers` methods over native window methods                                | ✅  |     |     |
| [require-valid-css-selector-in-test-helpers](docs/rules/require-valid-css-selector-in-test-helpers.md)                                                                                                                                   | disallow using invalid CSS selectors in test helpers                                                     | ✅  | 🔧  |     |

<!-- end auto-generated rules list -->

## 🍻 Contribution Guide

If you have any suggestions, ideas, or problems, feel free to [create an issue](https://github.com/ember-cli/eslint-plugin-ember/issues/new), but first please make sure your question does not repeat [previous ones](https://github.com/ember-cli/eslint-plugin-ember/issues).

### Creating a New Rule

- [Create an issue](https://github.com/ember-cli/eslint-plugin-ember/issues/new) with a description of the proposed rule
- Create files for the [new rule](https://eslint.org/docs/developer-guide/working-with-rules):
  - `lib/rules/new-rule.js` (implementation, see [no-proxies](lib/rules/no-proxies.js) for an example)
  - `docs/rules/new-rule.md` (documentation, start from the template -- [raw](https://raw.githubusercontent.com/ember-cli/eslint-plugin-ember/master/docs/rules/_TEMPLATE_.md), [rendered](docs/rules/_TEMPLATE_.md))
  - `tests/lib/rules/new-rule.js` (tests, see [no-proxies](tests/lib/rules/no-proxies.js) for an example)
- Run `yarn update` to automatically update the README and other files (and re-run this if you change the rule name or description)
- Make sure your changes will pass [CI](./.github/workflows/ci.yml) by running:
  - `yarn test`
  - `yarn lint` (`yarn lint:js --fix` can fix many errors)
- Create a PR and link the created issue in the description

Note that new rules should not immediately be added to the [recommended](./lib/recommended-rules.js) configuration, as we only consider such breaking changes during major version updates.

## 🔓 License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).
