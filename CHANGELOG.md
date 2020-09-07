## v9.0.0 (2020-09-07)

#### :boom: Breaking Change
* [#940](https://github.com/ember-cli/eslint-plugin-ember/pull/940) Enable additional [recommended](https://github.com/ember-cli/eslint-plugin-ember/blob/master/lib/recommended-rules.js) rules ([@bmish](https://github.com/bmish))
  * [no-assignment-of-untracked-properties-used-in-tracking-contexts](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-assignment-of-untracked-properties-used-in-tracking-contexts.md)
  * [no-controller-access-in-routes](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-controller-access-in-routes.md)
  * [no-invalid-test-waiters](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-invalid-test-waiters.md)
  * [no-noop-setup-on-error-in-before](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-noop-setup-on-error-in-before.md)
  * [no-test-this-render](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-test-this-render.md)
  * [prefer-ember-test-helpers](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/prefer-ember-test-helpers.md)
* [#943](https://github.com/ember-cli/eslint-plugin-ember/pull/943) Enable `catchEvents` option in [no-side-effects](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-side-effects.md) rule ([@bmish](https://github.com/bmish))
* [#942](https://github.com/ember-cli/eslint-plugin-ember/pull/942) Enable `catchSafeObjects` option in [no-get](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-get.md) rule ([@bmish](https://github.com/bmish))
* [#941](https://github.com/ember-cli/eslint-plugin-ember/pull/941) Enable `catchRouterMicrolib` and `catchRouterMain` options in [no-private-routing-service](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-private-routing-service.md) rule ([@bmish](https://github.com/bmish))
* [#939](https://github.com/ember-cli/eslint-plugin-ember/pull/939) Drop ESLint 5 support and add peer dependency on ESLint 6+ ([@bmish](https://github.com/bmish))
* [#938](https://github.com/ember-cli/eslint-plugin-ember/pull/938) Drop Node 13 support ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v8.14.0 (2020-09-07)

#### :rocket: Enhancement
* [#934](https://github.com/ember-cli/eslint-plugin-ember/pull/934) Add support and enforcement for spread syntax in `order-in-*` rules ([@bmish](https://github.com/bmish))
* [#928](https://github.com/ember-cli/eslint-plugin-ember/pull/928) Refactor [require-super-in-init](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/require-super-in-init.md) rule to improve performance ([@bmish](https://github.com/bmish))

#### :bug: Bug Fix
* [#933](https://github.com/ember-cli/eslint-plugin-ember/pull/933) Fix spread syntax crash in [routes-segments-snake-case](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/routes-segments-snake-case.md) rule ([@bmish](https://github.com/bmish))
* [#932](https://github.com/ember-cli/eslint-plugin-ember/pull/932) Fix spread syntax crash in [route-path-style](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/route-path-style.md) rule ([@bmish](https://github.com/bmish))
* [#930](https://github.com/ember-cli/eslint-plugin-ember/pull/930) Fix spread syntax crash in [no-restricted-resolver-tests](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-restricted-resolver-tests.md) rule ([@bmish](https://github.com/bmish))
* [#931](https://github.com/ember-cli/eslint-plugin-ember/pull/931) Fix spread syntax crash in [no-unnecessary-route-path-option](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-unnecessary-route-path-option.md) rule ([@bmish](https://github.com/bmish))
* [#929](https://github.com/ember-cli/eslint-plugin-ember/pull/929) Fix spread syntax crash in [avoid-using-needs-in-controllers](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/avoid-using-needs-in-controllers.md) rule ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#935](https://github.com/ember-cli/eslint-plugin-ember/pull/935) Add some more spread syntax tests ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v8.13.0 (2020-08-26)

#### :rocket: Enhancement
* [#920](https://github.com/ember-cli/eslint-plugin-ember/pull/920) Add new rule [no-noop-setup-on-error-in-before](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-noop-setup-on-error-in-before.md) ([@v-korshun](https://github.com/v-korshun))

#### :bug: Bug Fix
* [#923](https://github.com/ember-cli/eslint-plugin-ember/pull/923) Fix crash with spread syntax in [no-actions-hash](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-actions-hash.md) rule ([@bmish](https://github.com/bmish))

#### Committers: 2
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Viktar ([@v-korshun](https://github.com/v-korshun))

## v8.12.0 (2020-08-18)

#### :rocket: Enhancement
* [#916](https://github.com/ember-cli/eslint-plugin-ember/pull/916) Add `catchEvents` option (default false) to [no-side-effects](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-side-effects.md) rule ([@bmish](https://github.com/bmish))

#### :bug: Bug Fix
* [#914](https://github.com/ember-cli/eslint-plugin-ember/pull/914) Improve `set()` detection logic in [no-side-effects](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-side-effects.md) rule to avoid false positives, catch missed cases, and check imports ([@bmish](https://github.com/bmish))
* [#919](https://github.com/ember-cli/eslint-plugin-ember/pull/919) Fix crash with variable path in [route-path-style](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/route-path-style.md) rule ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v8.11.0 (2020-08-14)

#### :rocket: Enhancement
* [#912](https://github.com/ember-cli/eslint-plugin-ember/pull/912) Add `catchSafeObjects` option (default false) to [no-get](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-get.md) rule to catch `get(foo, 'bar')` ([@bmish](https://github.com/bmish))
* [#913](https://github.com/ember-cli/eslint-plugin-ember/pull/913) Add `catchUnsafeObjects` option (default false) to [no-get](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-get.md) rule to catch `foo.get('bar')` ([@bmish](https://github.com/bmish))

#### :bug: Bug Fix
* [#911](https://github.com/ember-cli/eslint-plugin-ember/pull/911) Update [no-test-import-export](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-test-import-export.md) rule to allow importing from anything under `tests/helpers` path (when using relative path) ([@bmish](https://github.com/bmish))
* [#909](https://github.com/ember-cli/eslint-plugin-ember/pull/909) Check imports when detecting computed properties in many rules ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))


## v8.10.1 (2020-08-07)

#### :bug: Bug Fix
* [#908](https://github.com/ember-cli/eslint-plugin-ember/pull/908) Check imported `get`/`getProperties`/`getWithDefault` functions for missing dependencies in [require-computed-property-dependencies](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/require-computed-property-dependencies.md) rule ([@bmish](https://github.com/bmish))
* [#907](https://github.com/ember-cli/eslint-plugin-ember/pull/907) Check imports in [require-computed-property-dependencies](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/require-computed-property-dependencies.md) rule ([@bmish](https://github.com/bmish))
* [#906](https://github.com/ember-cli/eslint-plugin-ember/pull/906) Avoid crash from classes extending a non-identifier superclass during Ember core module check ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v8.10.0 (2020-08-05)

#### :rocket: Enhancement
* [#898](https://github.com/ember-cli/eslint-plugin-ember/pull/898) Add new rule [no-controller-access-in-routes](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-controller-access-in-routes.md) ([@emonroy](https://github.com/emonroy))
* [#887](https://github.com/ember-cli/eslint-plugin-ember/pull/887) Add option for custom computed property macros in [no-assignment-of-untracked-properties-used-in-tracking-contexts](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-assignment-of-untracked-properties-used-in-tracking-contexts.md) rule ([@mongoose700](https://github.com/mongoose700))

#### Committers: 2
- Eduardo Monroy Martínez ([@emonroy](https://github.com/emonroy))
- Michael Peirce ([@mongoose700](https://github.com/mongoose700))

## v8.9.2 (2020-07-23)

#### :bug: Bug Fix
* [#895](https://github.com/ember-cli/eslint-plugin-ember/pull/895) Update [no-test-import-export](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-test-import-export.md) rule to allow importing from anything under `tests/helpers` path ([@bmish](https://github.com/bmish))
* [#894](https://github.com/ember-cli/eslint-plugin-ember/pull/894) Ensure [no-attrs-in-components](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-attrs-in-components.md) rule only runs inside components ([@bmish](https://github.com/bmish))
* [#893](https://github.com/ember-cli/eslint-plugin-ember/pull/893) Support array element access in [no-get](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-get.md) rule autofix ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#888](https://github.com/ember-cli/eslint-plugin-ember/pull/888) Add npm-package-json-lint ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v8.9.1 (2020-07-05)

#### :bug: Bug Fix
* [#883](https://github.com/ember-cli/eslint-plugin-ember/pull/883) Gather dependent keys from computed property macros in [no-assignment-of-untracked-properties-used-in-tracking-contexts](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-assignment-of-untracked-properties-used-in-tracking-contexts.md) rule ([@bmish](https://github.com/bmish))
* [#880](https://github.com/ember-cli/eslint-plugin-ember/pull/880) Check imports in [no-get](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-get.md) rule ([@bmish](https://github.com/bmish))
* [#881](https://github.com/ember-cli/eslint-plugin-ember/pull/881) Check imports in [no-get-with-default](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-get-with-default.md) rule ([@bmish](https://github.com/bmish))
* [#882](https://github.com/ember-cli/eslint-plugin-ember/pull/882) Check imports in [no-pause-test](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-pause-test.md) rule ([@bmish](https://github.com/bmish))
* [#879](https://github.com/ember-cli/eslint-plugin-ember/pull/879) Autofix nested paths in the left side of an assignment without using optional chaining in the [no-get](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-get.md) rule ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v8.9.0 (2020-06-28)

#### :rocket: Enhancement
* [#871](https://github.com/ember-cli/eslint-plugin-ember/pull/871) Add `catchRouterMain` option (default false) to [no-private-routing-service](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-private-routing-service.md) rule ([@bmish](https://github.com/bmish))

#### :bug: Bug Fix
* [#870](https://github.com/ember-cli/eslint-plugin-ember/pull/870) Fix false positive involving `this` keyword with `filterBy` / `mapBy` in [require-computed-macros](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/require-computed-macros.md) rule ([@bmish](https://github.com/bmish))
* [#868](https://github.com/ember-cli/eslint-plugin-ember/pull/868) Fix false negatives in [no-invalid-test-waiters](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-invalid-test-waiters.md) rule ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v8.8.0 (2020-06-24)

#### :rocket: Enhancement
* [#855](https://github.com/ember-cli/eslint-plugin-ember/pull/855) Add new rule [no-assignment-of-untracked-properties-used-in-tracking-contexts](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-assignment-of-untracked-properties-used-in-tracking-contexts.md) ([@bmish](https://github.com/bmish))

#### :bug: Bug Fix
* [#866](https://github.com/ember-cli/eslint-plugin-ember/pull/866) Fix missing import statement in autofix for [no-incorrect-computed-macros](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-incorrect-computed-macros.md) rule ([@bmish](https://github.com/bmish))
* [#864](https://github.com/ember-cli/eslint-plugin-ember/pull/864) Fix default value of `ignoreClassic` option to be true for [no-computed-properties-in-native-classes](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-computed-properties-in-native-classes.md) rule ([@jaydgruber](https://github.com/jaydgruber))
* [#857](https://github.com/ember-cli/eslint-plugin-ember/pull/857) Ignore the left side of an assignment (nested path case) in [require-computed-property-dependencies](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/require-computed-property-dependencies.md) rule ([@bmish](https://github.com/bmish))
* [#856](https://github.com/ember-cli/eslint-plugin-ember/pull/856) Handle nested paths with ES5 setters in [no-side-effects](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-side-effects.md) rule ([@bmish](https://github.com/bmish))

#### Committers: 2
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- [@jaydgruber](https://github.com/jaydgruber)

## v8.7.0 (2020-06-15)

#### :rocket: Enhancement
* [#845](https://github.com/ember-cli/eslint-plugin-ember/pull/845) Add `useOptionalChaining` option (default false) to [no-get](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-get.md) rule ([@bmish](https://github.com/bmish)
* [#840](https://github.com/ember-cli/eslint-plugin-ember/pull/840) Add `includeNativeGetters` option (default false) to [require-computed-macros](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/require-computed-macros.md) rule ([@bmish](https://github.com/bmish))
* [#848](https://github.com/ember-cli/eslint-plugin-ember/pull/848) Support optional chaining in [require-computed-property-dependencies](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/require-computed-property-dependencies.md) rule ([@bmish](https://github.com/bmish))
* [#846](https://github.com/ember-cli/eslint-plugin-ember/pull/846) Support optional chaining in [require-computed-macros](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/require-computed-macros.md) rule ([@bmish](https://github.com/bmish))
* [#839](https://github.com/ember-cli/eslint-plugin-ember/pull/839) Support `filterBy` and `mapBy` macros in [require-computed-macros](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/require-computed-macros.md) rule ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#842](https://github.com/ember-cli/eslint-plugin-ember/pull/842) Explain why [require-return-from-computed](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/require-return-from-computed.md) rule does not apply to native classes ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v8.6.0 (2020-06-02)

#### :rocket: Enhancement
* [#827](https://github.com/ember-cli/eslint-plugin-ember/pull/827) Add new rule [no-restricted-service-injections](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-restricted-service-injections.md) ([@bmish](https://github.com/bmish))
* [#826](https://github.com/ember-cli/eslint-plugin-ember/pull/826) Update [no-computed-properties-in-native-classes](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-computed-properties-in-native-classes.md) rule to ignore classes marked `@classic` ([@jaydgruber](https://github.com/jaydgruber))

#### :memo: Documentation
* [#834](https://github.com/ember-cli/eslint-plugin-ember/pull/834) Add link to jQuery RFCs in [no-jquery](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-jquery.md) rule doc ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#828](https://github.com/ember-cli/eslint-plugin-ember/pull/828) Ensure rule docs mention all rule configuration options ([@bmish](https://github.com/bmish))

#### Committers: 2
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- [@jaydgruber](https://github.com/jaydgruber)

## v8.5.2 (2020-05-21)

#### :bug: Bug Fix
* [#821](https://github.com/ember-cli/eslint-plugin-ember/pull/821) Avoid some false positives when detecting if a file is an Ember component, controller, etc ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#823](https://github.com/ember-cli/eslint-plugin-ember/pull/823) Include recommended fix in [no-ember-super-in-es-classes](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-ember-super-in-es-classes.md) rule error message ([@GoygovRustam](https://github.com/GoygovRustam))

#### Committers: 2
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Rustam Goygov ([@GoygovRustam](https://github.com/GoygovRustam))

## v8.5.1 (2020-05-10)

#### :bug: Bug Fix
* [#813](https://github.com/ember-cli/eslint-plugin-ember/pull/813) Fix false positive with multiple imports in [prefer-ember-test-helpers](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/prefer-ember-test-helpers.md) rule ([@bmish](https://github.com/bmish))
* [#812](https://github.com/ember-cli/eslint-plugin-ember/pull/812) Fix false negative when aliasing import in [prefer-ember-test-helpers](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/prefer-ember-test-helpers.md) rule ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#814](https://github.com/ember-cli/eslint-plugin-ember/pull/814) Upgrade to eslint 7 internally ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v8.5.0 (2020-05-06)

#### :rocket: Enhancement
* [#795](https://github.com/ember-cli/eslint-plugin-ember/pull/795) Add `catchRouterMicrolib` option (default false) to [no-private-routing-service](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-private-routing-service.md) rule ([@nlfurniss](https://github.com/nlfurniss))

#### :bug: Bug Fix
* [#802](https://github.com/ember-cli/eslint-plugin-ember/pull/802) Ignore `mirage/config.js` file in [no-get](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-get.md) rule ([@BarryThePenguin](https://github.com/BarryThePenguin))
* [#800](https://github.com/ember-cli/eslint-plugin-ember/pull/800) Handle `@computed` decorator without parentheses in [no-side-effects](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-side-effects.md) and [require-computed-property-dependencies](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/require-computed-property-dependencies.md) rules ([@mongoose700](https://github.com/mongoose700))
* [#794](https://github.com/ember-cli/eslint-plugin-ember/pull/794) Handle braces without nesting in [require-computed-property-dependencies](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/require-computed-property-dependencies.md) rule ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#797](https://github.com/ember-cli/eslint-plugin-ember/pull/797) Remove duplicate example from [no-observers](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-observers.md) rule doc ([@mehrdadrafiee](https://github.com/mehrdadrafiee))

#### :house: Internal
* [#801](https://github.com/ember-cli/eslint-plugin-ember/pull/801) Begin testing under Node 14 ([@bmish](https://github.com/bmish))

#### Committers: 5
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Jonathan Haines ([@BarryThePenguin](https://github.com/BarryThePenguin))
- Mehrdad Rafiee ([@mehrdadrafiee](https://github.com/mehrdadrafiee))
- Michael Peirce ([@mongoose700](https://github.com/mongoose700))
- Nathaniel Furniss ([@nlfurniss](https://github.com/nlfurniss))

## v8.4.0 (2020-04-15)

#### :rocket: Enhancement
* [#767](https://github.com/ember-cli/eslint-plugin-ember/pull/767) Add new rule [prefer-ember-test-helpers](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/prefer-ember-test-helpers.md) ([@fierysunset](https://github.com/fierysunset))
* [#778](https://github.com/ember-cli/eslint-plugin-ember/pull/778) Add new rule [no-test-this-render](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-test-this-render.md) ([@ventuno](https://github.com/ventuno))
* [#789](https://github.com/ember-cli/eslint-plugin-ember/pull/789) Add decorator support to [no-side-effects](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-side-effects.md) rule ([@bmish](https://github.com/bmish))
* [#790](https://github.com/ember-cli/eslint-plugin-ember/pull/790) Catch assignment in [no-side-effects](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-side-effects.md) rule ([@bmish](https://github.com/bmish))

#### :bug: Bug Fix
* [#786](https://github.com/ember-cli/eslint-plugin-ember/pull/786) Ignore the left side of an assignment in [require-computed-property-dependencies](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/require-computed-property-dependencies.md) rule ([@bmish](https://github.com/bmish))

#### Committers: 3
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Connie C Chang ([@fierysunset](https://github.com/fierysunset))
- [@ventuno](https://github.com/ventuno)

## v8.3.0 (2020-04-14)

#### :rocket: Enhancement
* [#775](https://github.com/ember-cli/eslint-plugin-ember/pull/775) Add support for explicit getter functions in [require-computed-property-dependencies](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/require-computed-property-dependencies.md) rule ([@bmish](https://github.com/bmish))
* [#779](https://github.com/ember-cli/eslint-plugin-ember/pull/779) Add decorator support to [require-computed-property-dependencies](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/require-computed-property-dependencies.md) rule ([@bmish](https://github.com/bmish))
* [#781](https://github.com/ember-cli/eslint-plugin-ember/pull/781) Add decorator support to [no-unnecessary-service-injection-argument](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-unnecessary-service-injection-argument.md) rule ([@bmish](https://github.com/bmish))
* [#773](https://github.com/ember-cli/eslint-plugin-ember/pull/773) Add autofixer to [no-duplicate-dependent-keys](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-duplicate-dependent-keys.md) rule ([@bmish](https://github.com/bmish))
* [#774](https://github.com/ember-cli/eslint-plugin-ember/pull/774) Catch spaces in [no-invalid-dependent-keys](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-invalid-dependent-keys.md) rule ([@bmish](https://github.com/bmish))
* [#768](https://github.com/ember-cli/eslint-plugin-ember/pull/768) Catch leading or trailing periods in [no-invalid-dependent-keys](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-invalid-dependent-keys.md) ([@bmish](https://github.com/bmish))

#### :bug: Bug Fix
* [#771](https://github.com/ember-cli/eslint-plugin-ember/pull/771) Fix false positives in [no-legacy-test-waiters](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-legacy-test-waiters.md) rule ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v8.2.0 (2020-04-10)

#### :rocket: Enhancement
* [#764](https://github.com/ember-cli/eslint-plugin-ember/pull/764) Catch unnecessary braces in [no-invalid-dependent-keys](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-invalid-dependent-keys.md) rule ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#759](https://github.com/ember-cli/eslint-plugin-ember/pull/759) Update each rule doc to mention what config enables the rule ([@bmish](https://github.com/bmish))
* [#758](https://github.com/ember-cli/eslint-plugin-ember/pull/758) Fix typo in example in [no-side-effects](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-side-effects.md) rule doc ([@mehrdadrafiee](https://github.com/mehrdadrafiee))

#### :house: Internal
* [#766](https://github.com/ember-cli/eslint-plugin-ember/pull/766) Add test for [no-replace-test-comments](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-replace-test-comments.md) rule with TODO-prefixed comment ([@bmish](https://github.com/bmish))
* [#757](https://github.com/ember-cli/eslint-plugin-ember/pull/757) Add tests that configs are exported and mentioned in the README ([@bmish](https://github.com/bmish))

#### Committers: 2
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Mehrdad Rafiee ([@mehrdadrafiee](https://github.com/mehrdadrafiee))

## v8.1.1 (2020-04-01)

#### :bug: Bug Fix
* [#752](https://github.com/ember-cli/eslint-plugin-ember/pull/752) Remove [no-empty-attrs](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-empty-attrs.md) from `recommended` config ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#755](https://github.com/ember-cli/eslint-plugin-ember/pull/755) Add note about nullish coalescing operator in [no-get-with-default](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-get-with-default.md) rule doc ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v8.1.0 (2020-03-29)

#### :rocket: Enhancement
* [#747](https://github.com/ember-cli/eslint-plugin-ember/pull/747) Add autofixer to [no-get-with-default](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-get-with-default.md) rule ([@bmish](https://github.com/bmish))

#### :bug: Bug Fix
* [#746](https://github.com/ember-cli/eslint-plugin-ember/pull/746) Do not disable non-recommended rules in the `recommended` config ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#749](https://github.com/ember-cli/eslint-plugin-ember/pull/749) Add missing init hook super calls in rule examples ([@bmish](https://github.com/bmish))
* [#748](https://github.com/ember-cli/eslint-plugin-ember/pull/748) Switch to new module imports in rule examples ([@bmish](https://github.com/bmish))
* [#745](https://github.com/ember-cli/eslint-plugin-ember/pull/745) Replace `this.get('property')` with `this.property` in rule examples ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v8.0.0 (2020-03-28)

#### :boom: Breaking Change
* [#730](https://github.com/ember-cli/eslint-plugin-ember/pull/730) Drop Node 8, 9, and 11 support ([@bmish](https://github.com/bmish))
* [#729](https://github.com/ember-cli/eslint-plugin-ember/pull/729) Update `ignoreNestedPaths` option default to `false` for [no-get](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-get.md) rule ([@bmish](https://github.com/bmish))
* [#731](https://github.com/ember-cli/eslint-plugin-ember/pull/731) Enable additional [recommended](https://github.com/ember-cli/eslint-plugin-ember/blob/master/lib/recommended-rules.js) rules ([@bmish](https://github.com/bmish))
  * [no-empty-attrs](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-empty-attrs.md)
  * [no-get-with-default](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-get-with-default.md) (formerly in the [octane](https://github.com/ember-cli/eslint-plugin-ember/blob/master/lib/octane-rules.js) config)
  * [no-get](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-get.md) (formerly in the [octane](https://github.com/ember-cli/eslint-plugin-ember/blob/master/lib/octane-rules.js) config)
  * [no-incorrect-computed-macros](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-incorrect-computed-macros.md)
  * [no-invalid-dependent-keys](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-invalid-dependent-keys.md)
  * [no-jquery](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-jquery.md) (formerly in the [octane](https://github.com/ember-cli/eslint-plugin-ember/blob/master/lib/octane-rules.js) config)
  * [no-legacy-test-waiters](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-legacy-test-waiters.md)
  * [no-mixins](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-mixins.md)
  * [no-pause-test](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-pause-test.md)
  * [no-private-routing-service](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-private-routing-service.md)
  * [no-test-and-then](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-test-and-then.md)
  * [no-test-import-export](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-test-import-export.md)
  * [no-test-module-for](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-test-module-for.md)
  * [require-computed-macros](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/require-computed-macros.md)
  * [require-computed-property-dependencies](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/require-computed-property-dependencies.md)
  * [use-ember-data-rfc-395-imports](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/use-ember-data-rfc-395-imports.md)

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v7.13.0 (2020-03-28)

#### :rocket: Enhancement
* [#742](https://github.com/ember-cli/eslint-plugin-ember/pull/742) Detect invalid position of `@each` or `[]` in [no-invalid-dependent-keys](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-invalid-dependent-keys.md) rule ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#741](https://github.com/ember-cli/eslint-plugin-ember/pull/741) Switch from Travis to GitHub Actions for CI ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v7.12.0 (2020-03-27)

#### :rocket: Enhancement
* [#738](https://github.com/ember-cli/eslint-plugin-ember/pull/738) Use sets instead of arrays for better performance ([@bmish](https://github.com/bmish))
* [#702](https://github.com/ember-cli/eslint-plugin-ember/pull/702) Add new rule [no-invalid-test-waiters](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-invalid-test-waiters.md) ([@scalvert](https://github.com/scalvert))

#### :memo: Documentation
* [#737](https://github.com/ember-cli/eslint-plugin-ember/pull/737) Mention tracked properties as a fix for [classic-decorator-no-classic-methods](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/classic-decorator-no-classic-methods.md) ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#732](https://github.com/ember-cli/eslint-plugin-ember/pull/732) Begin testing under Node 13 ([@bmish](https://github.com/bmish))

#### Committers: 2
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Steve Calvert ([@scalvert](https://github.com/scalvert))

## v7.11.1 (2020-03-25)

#### :bug: Bug Fix
* [#728](https://github.com/ember-cli/eslint-plugin-ember/pull/728) Allow brace expansion with `and`, `or` macros in [no-incorrect-computed-macros](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-incorrect-computed-macros.md) rule ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#724](https://github.com/ember-cli/eslint-plugin-ember/pull/724) Recategorize rules in README ([@bmish](https://github.com/bmish))
* [#723](https://github.com/ember-cli/eslint-plugin-ember/pull/723) Sort rule categories alphabetically in README ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v7.11.0 (2020-03-20)

#### :rocket: Enhancement
* [#695](https://github.com/ember-cli/eslint-plugin-ember/pull/695) Add new rule [no-incorrect-computed-macros](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-incorrect-computed-macros.md) ([@bmish](https://github.com/bmish))
* [#709](https://github.com/ember-cli/eslint-plugin-ember/pull/709) Add new rule [no-invalid-dependent-keys](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-invalid-dependent-keys.md) ([@TheMBTH](https://github.com/TheMBTH))
* [#718](https://github.com/ember-cli/eslint-plugin-ember/pull/718) Add new rule [no-replace-test-comments](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-replace-test-comments.md) ([@jaydgruber](https://github.com/jaydgruber))
* [#705](https://github.com/ember-cli/eslint-plugin-ember/pull/705) Support TypeScript files when checking if rules are running on Ember module or test files ([@bmish](https://github.com/bmish))

#### :bug: Bug Fix
* [#719](https://github.com/ember-cli/eslint-plugin-ember/pull/719) Validate imports before reporting violations in [no-invalid-debug-function-arguments](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-invalid-debug-function-arguments.md) rule ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#716](https://github.com/ember-cli/eslint-plugin-ember/pull/716) Revamp the guide for contributing a new rule ([@bmish](https://github.com/bmish))
* [#715](https://github.com/ember-cli/eslint-plugin-ember/pull/715) Mention if a rule is auto-fixable in its documentation ([@bmish](https://github.com/bmish))
* [#713](https://github.com/ember-cli/eslint-plugin-ember/pull/713) Add tests to ensure each rule documentation file has the right title and an examples section ([@bmish](https://github.com/bmish))
* [#711](https://github.com/ember-cli/eslint-plugin-ember/pull/711) Improve contribution guide for adding new rules ([@TheMBTH](https://github.com/TheMBTH))

#### :house: Internal
* [#720](https://github.com/ember-cli/eslint-plugin-ember/pull/720) Add tests to ensure some computed property rules handle the @computed decorator ([@bmish](https://github.com/bmish))

#### Committers: 3
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- L@elaps ([@TheMBTH](https://github.com/TheMBTH))
- [@jaydgruber](https://github.com/jaydgruber)

## v7.10.1 (2020-03-07)

#### :bug: Bug Fix
* [#697](https://github.com/ember-cli/eslint-plugin-ember/pull/697) Handle service injections with no arguments in `no-private-routing-service` rule ([@nlfurniss](https://github.com/nlfurniss))

#### Committers: 1
- Nathaniel Furniss ([@nlfurniss](https://github.com/nlfurniss))

## v7.10.0 (2020-03-06)

#### :rocket: Enhancement
* [#694](https://github.com/ember-cli/eslint-plugin-ember/pull/694) Add new rule `no-private-routing-service` ([@nlfurniss](https://github.com/nlfurniss))
* [#691](https://github.com/ember-cli/eslint-plugin-ember/pull/691) Add new rule `no-mixins` ([@nlfurniss](https://github.com/nlfurniss))

#### Committers: 1
- Nathaniel Furniss ([@nlfurniss](https://github.com/nlfurniss))

## v7.9.0 (2020-03-01)

#### :rocket: Enhancement
* [#595](https://github.com/ember-cli/eslint-plugin-ember/pull/595) Add new rule `no-component-lifecycle-hooks` (included in `octane` config) ([@jbandura](https://github.com/jbandura))
* [#681](https://github.com/ember-cli/eslint-plugin-ember/pull/681) Add new rule `no-legacy-test-waiters` ([@scalvert](https://github.com/scalvert))

#### :memo: Documentation
* [#688](https://github.com/ember-cli/eslint-plugin-ember/pull/688) Lint code samples with eslint-plugin-markdown ([@bmish](https://github.com/bmish))

#### Committers: 3
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Jacek Bandura ([@jbandura](https://github.com/jbandura))
- Steve Calvert ([@scalvert](https://github.com/scalvert))

## v7.8.1 (2020-02-14)

#### :bug: Bug Fix
* [#674](https://github.com/ember-cli/eslint-plugin-ember/pull/674) Update `require-computed-property-dependencies` rule to handle basic string concatenation in dependent keys ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#669](https://github.com/ember-cli/eslint-plugin-ember/pull/669) Add "Help Wanted" section to documentation for rules that are missing native JavaScript class support ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v7.8.0 (2020-02-12)

#### :rocket: Enhancement
* [#661](https://github.com/ember-cli/eslint-plugin-ember/pull/661) Add new rule `no-controllers` ([@bmish](https://github.com/bmish))
* [#665](https://github.com/ember-cli/eslint-plugin-ember/pull/665) Update `order-in-*` rules to support custom ordering of properties ([@cdtinney](https://github.com/cdtinney))
* [#639](https://github.com/ember-cli/eslint-plugin-ember/pull/639) Update `no-observers` rule to catch `addObserver` and observer imports ([@kategengler](https://github.com/kategengler))

#### :bug: Bug Fix
* [#670](https://github.com/ember-cli/eslint-plugin-ember/pull/670) Update `order-in-*` rules to consider template literals as properties ([@cdtinney](https://github.com/cdtinney))
* [#664](https://github.com/ember-cli/eslint-plugin-ember/pull/664) Update `no-classic-components` rule to only disallow the specific component import ([@bmish](https://github.com/bmish))
* [#640](https://github.com/ember-cli/eslint-plugin-ember/pull/640) Update `no-computed-properties-in-native-classes` rule to catch aliasing of computed import ([@kategengler](https://github.com/kategengler))

#### :memo: Documentation
* [#663](https://github.com/ember-cli/eslint-plugin-ember/pull/663) Update rule docs to use consistent headers and fix markdownlint violations ([@bmish](https://github.com/bmish))
* [#655](https://github.com/ember-cli/eslint-plugin-ember/pull/655) Update `no-new-mixins` rule documentation ([@efx](https://github.com/efx))
* [#648](https://github.com/ember-cli/eslint-plugin-ember/pull/648) Fix various spelling mistakes ([@bmish](https://github.com/bmish))
* [#647](https://github.com/ember-cli/eslint-plugin-ember/pull/647) Fix typo in `no-classic-components` rule documentation ([@rwwagner90](https://github.com/rwwagner90))
* [#626](https://github.com/ember-cli/eslint-plugin-ember/pull/626) Simplify and clarify rules and configuration sections in README ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#643](https://github.com/ember-cli/eslint-plugin-ember/pull/643) Add missing test case output assertions ([@bmish](https://github.com/bmish))

#### Committers: 5
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Colin Tinney ([@cdtinney](https://github.com/cdtinney))
- Eli Flanagan ([@efx](https://github.com/efx))
- Katie Gengler ([@kategengler](https://github.com/kategengler))
- Robert Wagner ([@rwwagner90](https://github.com/rwwagner90))

## v7.7.2 (2019-12-12)

#### :bug: Bug Fix
* [#621](https://github.com/ember-cli/eslint-plugin-ember/pull/621) Fix false positive with `ignoreNonThisExpressions` option in `use-ember-get-and-set` rule ([@Exelord](https://github.com/Exelord))

#### :memo: Documentation
* [#620](https://github.com/ember-cli/eslint-plugin-ember/pull/620) Use consistent prefixes for rule descriptions ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#625](https://github.com/ember-cli/eslint-plugin-ember/pull/625) Add eslint-plugin-jest internally and enable rules ([@bmish](https://github.com/bmish))
* [#624](https://github.com/ember-cli/eslint-plugin-ember/pull/624) Add eslint-plugin-unicorn internally and enable recommended rules ([@bmish](https://github.com/bmish))

#### Committers: 2
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Maciej Kwaśniak ([@Exelord](https://github.com/Exelord))

## v7.7.1 (2019-11-29)

#### :bug: Bug Fix
* [#615](https://github.com/ember-cli/eslint-plugin-ember/pull/615) Fix issue causing assert to fire in `getSourceModuleName` util function ([@patocallaghan](https://github.com/patocallaghan))

#### Committers: 1
- Pat O'Callaghan ([@patocallaghan](https://github.com/patocallaghan))

## v7.7.0 (2019-11-29)

#### :rocket: Enhancement
* [#592](https://github.com/ember-cli/eslint-plugin-ember/pull/592) Update `no-classic-classes` rule to catch classic Ember Data model classes ([@patocallaghan](https://github.com/patocallaghan))

#### :bug: Bug Fix
* [#610](https://github.com/ember-cli/eslint-plugin-ember/pull/610) Fix invalid `no-get` rule autofix caused by invalid JS variable name ([@bmish](https://github.com/bmish))
* [#607](https://github.com/ember-cli/eslint-plugin-ember/pull/607) Fix spread property bug in `require-super-in-init` rule ([@bmish](https://github.com/bmish))
* [#600](https://github.com/ember-cli/eslint-plugin-ember/pull/600) Add missing schema validation for options on many rules ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#611](https://github.com/ember-cli/eslint-plugin-ember/pull/611) Add many missing tests for lines without test coverage ([@bmish](https://github.com/bmish))

#### Committers: 2
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Pat O'Callaghan ([@patocallaghan](https://github.com/patocallaghan))

## v7.6.0 (2019-11-19)

#### :rocket: Enhancement
* [#594](https://github.com/ember-cli/eslint-plugin-ember/pull/594) Add new rule `no-get-with-default` ([@steventsao](https://github.com/steventsao))

#### Committers: 1
- Steven Tsao ([@steventsao](https://github.com/steventsao))

## v7.5.0 (2019-11-11)

#### :rocket: Enhancement
* [#583](https://github.com/ember-cli/eslint-plugin-ember/pull/583) Update `no-observers` rule to handle decorators ([@bmish](https://github.com/bmish))
* [#577](https://github.com/ember-cli/eslint-plugin-ember/pull/577) Add autofixer to `no-get` rule ([@bmish](https://github.com/bmish))

#### :bug: Bug Fix
* [#586](https://github.com/ember-cli/eslint-plugin-ember/pull/586) Update `use-brace-expansion` rule to only report the string arguments of a computed property as the violation (and not the entire function body) ([@bmish](https://github.com/bmish))
* [#581](https://github.com/ember-cli/eslint-plugin-ember/pull/581) Update `no-get` rule to ignore `get()` usages inside objects implementing `unknownProperty()` ([@bmish](https://github.com/bmish))
* [#580](https://github.com/ember-cli/eslint-plugin-ember/pull/580) Update `no-get` rule to ignore `get()` usages inside proxy objects ([@bmish](https://github.com/bmish))
* [#579](https://github.com/ember-cli/eslint-plugin-ember/pull/579) Fix handling of multi-line property keys by `require-computed-property-dependencies` rule ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#588](https://github.com/ember-cli/eslint-plugin-ember/pull/588) Add `type` meta property to each rule ([@bmish](https://github.com/bmish))
* [#587](https://github.com/ember-cli/eslint-plugin-ember/pull/587) And missing rule documentation URLs ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#582](https://github.com/ember-cli/eslint-plugin-ember/pull/582) Add CI check to ensure `yarn update` is run to update docs/autogenerated files ([@bmish](https://github.com/bmish))
* [#574](https://github.com/ember-cli/eslint-plugin-ember/pull/574) Update `reportUnorderedProperties` util function to also work with native classes  ([@laurmurclar](https://github.com/laurmurclar))

#### Committers: 2
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Laura Murphy-Clarkin ([@laurmurclar](https://github.com/laurmurclar))

## v7.4.1 (2019-11-07)

#### :bug: Bug Fix
* [#575](https://github.com/ember-cli/eslint-plugin-ember/pull/575) Update `avoid-leaking-state-in-ember-objects` rule to handle logical expressions ([@alexlafroscia](https://github.com/alexlafroscia))
* [#571](https://github.com/ember-cli/eslint-plugin-ember/pull/571) Update `avoid-leaking-state-in-ember-objects` rule to handle ternary expressions ([@alexlafroscia](https://github.com/alexlafroscia))
* [#573](https://github.com/ember-cli/eslint-plugin-ember/pull/573) Update `require-computed-macros` rule to handle `this.get('property')` (in addition to `this.property`) ([@bmish](https://github.com/bmish))

#### Committers: 2
- Alex LaFroscia ([@alexlafroscia](https://github.com/alexlafroscia))
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v7.4.0 (2019-11-06)

#### :rocket: Enhancement
* [#561](https://github.com/ember-cli/eslint-plugin-ember/pull/561) Add `octane` configuration (experimental) ([@patocallaghan](https://github.com/patocallaghan))
* [#562](https://github.com/ember-cli/eslint-plugin-ember/pull/562) Add new rule `no-test-module-for` ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#565](https://github.com/ember-cli/eslint-plugin-ember/pull/565) Add `ignoreNestedPaths` option (default true) to `no-get` rule ([@bmish](https://github.com/bmish))
* [#564](https://github.com/ember-cli/eslint-plugin-ember/pull/564) Update `no-new-mixins` rule to handle native classes ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#570](https://github.com/ember-cli/eslint-plugin-ember/pull/570) Simplify some tests by setting `parserOptions` globally instead of in each individual test case ([@bmish](https://github.com/bmish))
* [#568](https://github.com/ember-cli/eslint-plugin-ember/pull/568) Add tests to ensure plugin exports correct configurations ([@bmish](https://github.com/bmish))
* [#563](https://github.com/ember-cli/eslint-plugin-ember/pull/563) Lint against unnecessary template literals internally ([@bmish](https://github.com/bmish))

#### Committers: 3
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- L. Preston Sego III ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
- Pat O'Callaghan ([@patocallaghan](https://github.com/patocallaghan))

## v7.3.0 (2019-10-30)

#### :rocket: Enhancement
* [#555](https://github.com/ember-cli/eslint-plugin-ember/pull/555) Add new `no-actions-hash` rule ([@laurmurclar](https://github.com/laurmurclar))
* [#548](https://github.com/ember-cli/eslint-plugin-ember/pull/548) Add new `require-tagless-components` rule ([@alexlafroscia](https://github.com/alexlafroscia))
* [#552](https://github.com/ember-cli/eslint-plugin-ember/pull/552) Add new `no-classic-classes` rule ([@alexlafroscia](https://github.com/alexlafroscia))
* [#551](https://github.com/ember-cli/eslint-plugin-ember/pull/551) Add new `no-classic-components` rule ([@mikoscz](https://github.com/mikoscz))
* [#546](https://github.com/ember-cli/eslint-plugin-ember/pull/546) Add new `no-computed-properties-in-native-classes` rule ([@patocallaghan](https://github.com/patocallaghan))

#### :bug: Bug Fix
* [#553](https://github.com/ember-cli/eslint-plugin-ember/pull/553) Avoid crash from missing function check in `require-super-in-init` rule ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#554](https://github.com/ember-cli/eslint-plugin-ember/pull/554) Add rule documentation template ([@bmish](https://github.com/bmish))
* [#550](https://github.com/ember-cli/eslint-plugin-ember/pull/550) Modernize documentation for `alias-model-in-controller` rule ([@alexlafroscia](https://github.com/alexlafroscia))

#### :house: Internal
* [#558](https://github.com/ember-cli/eslint-plugin-ember/pull/558) Update `isEmberCoreModule` util function to also handle native classes (in addition to classic classes) ([@laurmurclar](https://github.com/laurmurclar))

#### Committers: 5
- Alex LaFroscia ([@alexlafroscia](https://github.com/alexlafroscia))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Laura Murphy-Clarkin ([@laurmurclar](https://github.com/laurmurclar))
- Michał Staśkiewicz ([@mikoscz](https://github.com/mikoscz))
- Pat O'Callaghan ([@patocallaghan](https://github.com/patocallaghan))

## v7.2.0 (2019-10-20)

#### :rocket: Enhancement
* [#545](https://github.com/ember-cli/eslint-plugin-ember/pull/545) Add `ignoreNonThisExpressions` option to `use-ember-get-and-set` rule ([@nlfurniss](https://github.com/nlfurniss))
* [#534](https://github.com/ember-cli/eslint-plugin-ember/pull/534) Add `onlyThisContexts` option to `no-arrow-function-computed-properties` rule ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#537](https://github.com/ember-cli/eslint-plugin-ember/pull/537) Add `ignoreGetProperties` option for `no-get` rule ([@EvgenyOrekhov](https://github.com/EvgenyOrekhov))

#### :house: Internal
* [#462](https://github.com/ember-cli/eslint-plugin-ember/pull/462) Refactor null checks for `new-module-imports` and `use-ember-data-rfc-395-imports` rules ([@dcyriller](https://github.com/dcyriller))
* [#528](https://github.com/ember-cli/eslint-plugin-ember/pull/528) Add eslint-plugin-node and enable recommended rules internally ([@bmish](https://github.com/bmish))
* [#524](https://github.com/ember-cli/eslint-plugin-ember/pull/524) Add eslint-plugin-filenames to enforce kebab-case filenames ([@bmish](https://github.com/bmish))
* [#523](https://github.com/ember-cli/eslint-plugin-ember/pull/523) Add eslint-plugin-eslint-comments and fix violations ([@bmish](https://github.com/bmish))

#### Committers: 5
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Cyrille David ([@dcyriller](https://github.com/dcyriller))
- Evgeny Orekhov ([@EvgenyOrekhov](https://github.com/EvgenyOrekhov))
- L. Preston Sego III ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
- Nathaniel Furniss ([@nlfurniss](https://github.com/nlfurniss))

## v7.1.0 (2019-09-18)

#### :rocket: Enhancement
* [#507](https://github.com/ember-cli/eslint-plugin-ember/pull/507) Add new `no-pause-test` rule ([@scottkidder](https://github.com/scottkidder))

#### :bug: Bug Fix
* [#511](https://github.com/ember-cli/eslint-plugin-ember/pull/511) Avoid crash from empty return statement in `require-computed-macros` rule ([@bmish](https://github.com/bmish))
* [#512](https://github.com/ember-cli/eslint-plugin-ember/pull/512) Avoid crash when missing arguments to `this.route()` in `route-path-style` rule ([@bmish](https://github.com/bmish))
* [#498](https://github.com/ember-cli/eslint-plugin-ember/pull/498) Fix decorator handling and improve error messages for `computed-property-getters` rule ([@Exelord](https://github.com/Exelord))
* [#504](https://github.com/ember-cli/eslint-plugin-ember/pull/504) Update `require-computed-property-dependencies` rule to ignore injected service names by default ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#514](https://github.com/ember-cli/eslint-plugin-ember/pull/514) Hide the deprecated rules section from the README if empty ([@bmish](https://github.com/bmish))
* [#510](https://github.com/ember-cli/eslint-plugin-ember/pull/510) Cleanup code samples in some of the new V7 recommended rules ([@bmish](https://github.com/bmish))
* [#496](https://github.com/ember-cli/eslint-plugin-ember/pull/496) Suggest using the eslint `consistent-return` rule alongside `require-return-from-computed` rule to help avoid false positives ([@bmish](https://github.com/bmish))
* [#506](https://github.com/ember-cli/eslint-plugin-ember/pull/506) Add example of a getter with an if statement for `require-return-from-computed` rule ([@bradleypriest](https://github.com/bradleypriest))

#### :house: Internal
* [#519](https://github.com/ember-cli/eslint-plugin-ember/pull/519) Add CI check to ensure yarn.lock is up-to-date ([@bmish](https://github.com/bmish))
* [#516](https://github.com/ember-cli/eslint-plugin-ember/pull/516) Test plugin under both eslint 5 and eslint 6 ([@bmish](https://github.com/bmish))
* [#515](https://github.com/ember-cli/eslint-plugin-ember/pull/515) Add eslint-plugin-eslint-plugin and enable/autofix most rules ([@bmish](https://github.com/bmish))
* [#505](https://github.com/ember-cli/eslint-plugin-ember/pull/505) Enforce minimum test coverage ([@bmish](https://github.com/bmish))
* [#503](https://github.com/ember-cli/eslint-plugin-ember/pull/503) Refactor utils to move type checking utils to a separate file and alphabetize ([@bmish](https://github.com/bmish))

#### Committers: 4
- Bradley Priest ([@bradleypriest](https://github.com/bradleypriest))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Maciej Kwaśniak ([@Exelord](https://github.com/Exelord))
- Scott Kidder ([@scottkidder](https://github.com/scottkidder))

## v7.0.0 (2019-08-23)

#### :boom: Breaking Change
* [#491](https://github.com/ember-cli/eslint-plugin-ember/pull/491) Drop eslint 4 support ([@bmish](https://github.com/bmish))
* [#486](https://github.com/ember-cli/eslint-plugin-ember/pull/486) Enable additional recommended rules (`no-arrow-function-computed-properties`, `no-deeply-nested-dependent-keys-with-each`, `no-ember-super-in-es-classes`, `no-incorrect-calls-with-inline-anonymous-functions`, `no-invalid-debug-function-arguments`, `no-new-mixins`, `no-unnecessary-route-path-option`, `no-volatile-computed-properties`, `require-return-from-computed`) ([@bmish](https://github.com/bmish))
* [#487](https://github.com/ember-cli/eslint-plugin-ember/pull/487) Remove deprecated rules (`avoid-leaking-state-in-components`, `local-modules`, `no-get-properties`) ([@bmish](https://github.com/bmish))
* [#485](https://github.com/ember-cli/eslint-plugin-ember/pull/485) Drop Node 6 support ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v6.10.1 (2019-08-23)

#### :bug: Bug Fix
* [#488](https://github.com/ember-cli/eslint-plugin-ember/pull/488) Update `require-computed-property-dependencies` rule to support eslint 3 and 4 ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#489](https://github.com/ember-cli/eslint-plugin-ember/pull/489) Document eslint 4 as the minimum supported version ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#482](https://github.com/ember-cli/eslint-plugin-ember/pull/482) Start testing plugin under Node 12 ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v6.10.0 (2019-08-19)

#### :rocket: Enhancement
* [#473](https://github.com/ember-cli/eslint-plugin-ember/pull/473) Add new `no-incorrect-calls-with-inline-anonymous-functions` rule ([@raycohen](https://github.com/raycohen))

#### :bug: Bug Fix
* [#476](https://github.com/ember-cli/eslint-plugin-ember/pull/476) Add `allowDynamicKeys` option (default true) to `require-computed-property-dependencies` rule ([@bmish](https://github.com/bmish))

#### Committers: 2
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Ray Cohen ([@raycohen](https://github.com/raycohen))

## v6.9.1 (2019-08-14)

#### :bug: Bug Fix
* [#472](https://github.com/ember-cli/eslint-plugin-ember/pull/472) Improve handling of nested keys inside braces for `require-computed-property-dependencies` rule ([@bmish](https://github.com/bmish))
* [#471](https://github.com/ember-cli/eslint-plugin-ember/pull/471) Improve detection of missing dependencies in `require-computed-property-dependencies` rule ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v6.9.0 (2019-08-12)

#### :rocket: Enhancement
* [#458](https://github.com/ember-cli/eslint-plugin-ember/pull/458) Add new rule `require-computed-property-dependencies` ([@bmish](https://github.com/bmish))

#### :bug: Bug Fix
* [#463](https://github.com/ember-cli/eslint-plugin-ember/pull/463) Fix false positives for import statements with `use-ember-data-rfc-395-imports` rule ([@fusion2004](https://github.com/fusion2004))

#### :house: Internal
* [#465](https://github.com/ember-cli/eslint-plugin-ember/pull/465) Add tests that rules are setup correctly (not missing tests, docs, exports, etc) ([@bmish](https://github.com/bmish))
* [#466](https://github.com/ember-cli/eslint-plugin-ember/pull/466) Fix eslint 6 rule test parser error ([@bmish](https://github.com/bmish))

#### Committers: 2
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Mark Oleson ([@fusion2004](https://github.com/fusion2004))

## v6.8.2 (2019-08-08)

#### :bug: Bug Fix
* [#461](https://github.com/ember-cli/eslint-plugin-ember/pull/461) Add null check in `new-module-imports` rule (again) ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v6.8.1 (2019-08-08)

#### :bug: Bug Fix
* [#460](https://github.com/ember-cli/eslint-plugin-ember/pull/460) Add null check in `new-module-imports` rule ([@dcyriller](https://github.com/dcyriller))

#### Committers: 1
- Cyrille David ([@dcyriller](https://github.com/dcyriller))

## v6.8.0 (2019-08-08)

#### :rocket: Enhancement
* [#450](https://github.com/ember-cli/eslint-plugin-ember/pull/450) Add new `use-ember-data-rfc-395-imports` rule ([@dcyriller](https://github.com/dcyriller))
* [#457](https://github.com/ember-cli/eslint-plugin-ember/pull/457) Add new `no-arrow-function-computed-properties` rule ([@bmish](https://github.com/bmish))
* [#445](https://github.com/ember-cli/eslint-plugin-ember/pull/445) Add new `no-proxies` rule ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#454](https://github.com/ember-cli/eslint-plugin-ember/pull/454) Improve justification for `no-observers` rule ([@efx](https://github.com/efx))

#### :house: Internal
* [#456](https://github.com/ember-cli/eslint-plugin-ember/pull/456) Upgrade from eslint 4 to 5 ([@bmish](https://github.com/bmish))

#### Committers: 3
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Cyrille David ([@dcyriller](https://github.com/dcyriller))
- Eli Flanagan ([@efx](https://github.com/efx))

## v6.7.1 (2019-07-02)

#### :bug: Bug Fix
* [#440](https://github.com/ember-cli/eslint-plugin-ember/pull/440) Add missing rules `classic-decorator-hooks` and `classic-decorator-no-classic-methods` to index.js ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v6.7.0 (2019-06-22)

#### :rocket: Enhancement
* [#436](https://github.com/ember-cli/eslint-plugin-ember/pull/436) Adds decorator rules to aid migration to Octane ([@pzuraq](https://github.com/pzuraq))
* [#434](https://github.com/ember-cli/eslint-plugin-ember/pull/434) Add new `no-volatile-computed-properties` rule ([@bmish](https://github.com/bmish))

#### :bug: Bug Fix
* [#432](https://github.com/ember-cli/eslint-plugin-ember/pull/432) Update `require-computed-macros` rule to suggest the `reads` macro instead of `readOnly` for computed properties with `return this.x` ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#435](https://github.com/ember-cli/eslint-plugin-ember/pull/435) Update ESLint config incl. Prettier ([@Turbo87](https://github.com/Turbo87))

#### Committers: 4
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Chris Garrett ([@pzuraq](https://github.com/pzuraq))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)


## v6.6.0 (2019-06-16)

#### :rocket: Enhancement
* [#429](https://github.com/ember-cli/eslint-plugin-ember/pull/429) Add new `require-computed-macros` rule ([@bmish](https://github.com/bmish))

#### :bug: Bug Fix
* [#428](https://github.com/ember-cli/eslint-plugin-ember/pull/428) Fix spread operator bug in `no-on-calls-in-components` rule ([@rajasegar](https://github.com/rajasegar))

#### :memo: Documentation
* [#431](https://github.com/ember-cli/eslint-plugin-ember/pull/431) Add link to `sendAction` deprecation RFC for `closure-actions` rule ([@bmish](https://github.com/bmish))

#### Committers: 2
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Rajasegar Chandran ([@rajasegar](https://github.com/rajasegar))

## v6.5.1 (2019-05-27)

#### :bug: Bug Fix
* [#427](https://github.com/ember-cli/eslint-plugin-ember/pull/427) Fix typo in error message for `no-get` rule ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v6.5.0 (2019-05-26)

#### :rocket: Enhancement
* [#421](https://github.com/ember-cli/eslint-plugin-ember/pull/421) Update the `no-get` rule to also handle the `getProperties` function, and mark the `no-get-properties` rule as deprecated ([@bmish](https://github.com/bmish))
* [#397](https://github.com/ember-cli/eslint-plugin-ember/pull/397) Add new `computed-property-getters` rule ([@jrjohnson](https://github.com/jrjohnson))

#### :memo: Documentation
* [#412](https://github.com/ember-cli/eslint-plugin-ember/pull/412) Update release instructions ([@bmish](https://github.com/bmish))

#### Committers: 2
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Jonathan Johnson ([@jrjohnson](https://github.com/jrjohnson))

## v6.4.1 (2019-04-21)

#### :bug: Bug Fix
* [#413](https://github.com/ember-cli/eslint-plugin-ember/pull/413) Ignore template literals in `no-get` and `no-get-properties` rules ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v6.4.0 (2019-04-21)

#### :rocket: Enhancement
* [#403](https://github.com/ember-cli/eslint-plugin-ember/pull/403) Add new `no-get-properties` rule ([@bmish](https://github.com/bmish))
* [#404](https://github.com/ember-cli/eslint-plugin-ember/pull/404) Add new `no-get` rule ([@bmish](https://github.com/bmish))

#### :bug: Bug Fix
* [#398](https://github.com/ember-cli/eslint-plugin-ember/pull/398) `no-unnecessary-route-path-option`: fix error when `path` is undefined ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#411](https://github.com/ember-cli/eslint-plugin-ember/pull/411) Update contributors ([@bmish](https://github.com/bmish))
* [#409](https://github.com/ember-cli/eslint-plugin-ember/pull/409) Update documentation for `require-return-from-computed` rule ([@esbanarango](https://github.com/esbanarango))

#### Committers: 2
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Esteban Arango Medina ([@esbanarango](https://github.com/esbanarango))

## v6.3.0 (2019-03-19)

#### :rocket: Enhancement
* [#369](https://github.com/ember-cli/eslint-plugin-ember/pull/369) Add new 'route-path-style' rule ([@bmish](https://github.com/bmish))
* [#372](https://github.com/ember-cli/eslint-plugin-ember/pull/372) Add new 'no-unnecessary-index-route'  rule ([@bmish](https://github.com/bmish))
* [#262](https://github.com/ember-cli/eslint-plugin-ember/pull/262) Add new 'require-return-from-computed' rule ([@gmurphey](https://github.com/gmurphey))
* [#378](https://github.com/ember-cli/eslint-plugin-ember/pull/378) Add new `no-unnecessary-service-injection-argument` rule ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#395](https://github.com/ember-cli/eslint-plugin-ember/pull/395) docs: improve `closure-action` rule examples ([@Caltor](https://github.com/Caltor))
* [#383](https://github.com/ember-cli/eslint-plugin-ember/pull/383) no-deeply-nested-dependent-keys-with-each: Fix documentation examples ([@Alonski](https://github.com/Alonski))

#### :house: Internal
* [#386](https://github.com/ember-cli/eslint-plugin-ember/pull/386) test: add null output assertions for lint rules / test cases with no autofixer. ([@bmish](https://github.com/bmish))

#### Committers: 4
- Alon Bukai ([@Alonski](https://github.com/Alonski))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Garrett Murphey ([@gmurphey](https://github.com/gmurphey))
- [@Caltor](https://github.com/Caltor)

## v6.2.0 (2019-01-28)

#### :rocket: Enhancement
* [#375](https://github.com/ember-cli/eslint-plugin-ember/pull/375) no-test-and-then: slight optimization ([@bmish](https://github.com/bmish))
* [#373](https://github.com/ember-cli/eslint-plugin-ember/pull/373) no-unnecessary-route-path-option: Add support for `--fix` ([@bmish](https://github.com/bmish))
* [#370](https://github.com/ember-cli/eslint-plugin-ember/pull/370) Add `no-unnecessary-route-path-option` rule ([@bmish](https://github.com/bmish))
* [#365](https://github.com/ember-cli/eslint-plugin-ember/pull/365) no-invalid-debug-function-arguments: Use dynamic error message ([@bmish](https://github.com/bmish))
* [#364](https://github.com/ember-cli/eslint-plugin-ember/pull/364) assert-arg-order: Rename to `no-invalid-debug-function-arguments` and detect invalid usages of `deprecate` and `warn` too ([@bmish](https://github.com/bmish))
* [#358](https://github.com/ember-cli/eslint-plugin-ember/pull/358) Add `assert-arg-order` rule ([@bmish](https://github.com/bmish))
* [#359](https://github.com/ember-cli/eslint-plugin-ember/pull/359) Add `no-deeply-nested-dependent-keys-with-each` rule ([@bmish](https://github.com/bmish))
* [#357](https://github.com/ember-cli/eslint-plugin-ember/pull/357) Add `no-test-and-then` rule ([@bmish](https://github.com/bmish))

#### :bug: Bug Fix
* [#371](https://github.com/ember-cli/eslint-plugin-ember/pull/371) no-test-and-then: Run only on test files ([@bmish](https://github.com/bmish))
* [#367](https://github.com/ember-cli/eslint-plugin-ember/pull/367) no-deeply-nested-dependent-keys-with-each: Fix false positives ([@bmish](https://github.com/bmish))
* [#366](https://github.com/ember-cli/eslint-plugin-ember/pull/366) no-invalid-debug-function-arguments: Fix false positives ([@bmish](https://github.com/bmish))
* [#362](https://github.com/ember-cli/eslint-plugin-ember/pull/362) assert-arg-order: Fix rule for `Ember.assert()` case ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#380](https://github.com/ember-cli/eslint-plugin-ember/pull/380) no-test-and-then: Add migration path docs ([@bmish](https://github.com/bmish))
* [#368](https://github.com/ember-cli/eslint-plugin-ember/pull/368) no-test-and-then: Fix code sample in docs ([@bmish](https://github.com/bmish))
* [#361](https://github.com/ember-cli/eslint-plugin-ember/pull/361) no-deeply-nested-dependent-keys-with-each: Fix docs typo ([@bmish](https://github.com/bmish))
* [#360](https://github.com/ember-cli/eslint-plugin-ember/pull/360) Use more specific array types in util jsdoc comments ([@bmish](https://github.com/bmish))
* [#355](https://github.com/ember-cli/eslint-plugin-ember/pull/355) avoid-leaking-state-in-ember-objects: Show usage example of `DEFAULT_IGNORED_PROPERTIES` ([@yoavfranco](https://github.com/yoavfranco))
* [#354](https://github.com/ember-cli/eslint-plugin-ember/pull/354) avoid-needs-in-controllers: Add documentation ([@quajo](https://github.com/quajo))

#### :house: Internal
* [#363](https://github.com/ember-cli/eslint-plugin-ember/pull/363) no-deeply-nested-dependent-keys-with-each: Add more tests ([@bmish](https://github.com/bmish))

#### Committers: 3
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Selase Krakani ([@quajo](https://github.com/quajo))
- Yoav M. Franco ([@yoavfranco](https://github.com/yoavfranco))


## v6.1.0 (2018-12-15)

#### :rocket: Enhancement
* [#350](https://github.com/ember-cli/eslint-plugin-ember/pull/350) Introduce `no-ember-super-in-es-classes` rule ([@dfreeman](https://github.com/dfreeman))
* [#298](https://github.com/ember-cli/eslint-plugin-ember/pull/298) no-jquery: Check for aliased imports from 'jquery' module ([@initram](https://github.com/initram))

#### :bug: Bug Fix
* [#353](https://github.com/ember-cli/eslint-plugin-ember/pull/353) Fix error with `avoid-leaking-state-in-ember-objects` and spread ([@nlfurniss](https://github.com/nlfurniss))
* [#348](https://github.com/ember-cli/eslint-plugin-ember/pull/348) Fix `no-restricted-resolver-tests` to narrow scope of rule ([@scalvert](https://github.com/scalvert))
* [#332](https://github.com/ember-cli/eslint-plugin-ember/pull/332) use-brace-expansion: Limit lint rule to only trigger for `computed()` but no other macros ([@gmurphey](https://github.com/gmurphey))

#### :memo: Documentation
* [#349](https://github.com/ember-cli/eslint-plugin-ember/pull/349) Update `avoid-leaking-state-in-ember-objects` documentation. ([@samselikoff](https://github.com/samselikoff))
* [#345](https://github.com/ember-cli/eslint-plugin-ember/pull/345) Fix typo on `getNoPOJOWithoutIntegrationTrueMessage`. ([@esbanarango](https://github.com/esbanarango))
* [#341](https://github.com/ember-cli/eslint-plugin-ember/pull/341) Clarify `no-ember-testing-in-module-scope` documentation. ([@cibernox](https://github.com/cibernox))

#### :house: Internal
* [#347](https://github.com/ember-cli/eslint-plugin-ember/pull/347) TravisCI: Remove deprecated `sudo: false` option ([@Turbo87](https://github.com/Turbo87))

#### Committers: 9
- Dan Freeman ([@dfreeman](https://github.com/dfreeman))
- Esteban Arango Medina ([@esbanarango](https://github.com/esbanarango))
- Garrett Murphey ([@gmurphey](https://github.com/gmurphey))
- Martin Midtgaard ([@initram](https://github.com/initram))
- Miguel Camba ([@cibernox](https://github.com/cibernox))
- Nathaniel Furniss ([@nlfurniss](https://github.com/nlfurniss))
- Sam Selikoff ([@samselikoff](https://github.com/samselikoff))
- Steve Calvert ([@scalvert](https://github.com/scalvert))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))

## v6.0.1 (2018-11-16)

#### :rocket: Enhancement
* [#331](https://github.com/ember-cli/eslint-plugin-ember/pull/331) Updating no-side-effects to also report on setProperties. ([@gmurphey](https://github.com/gmurphey))

#### :bug: Bug Fix
* [#340](https://github.com/ember-cli/eslint-plugin-ember/pull/340) no-restricted-resolver: Fix crashes ([@Turbo87](https://github.com/Turbo87))

#### :house: Internal
* [#335](https://github.com/ember-cli/eslint-plugin-ember/pull/335) Remove outdated `.nvmrc` file ([@Turbo87](https://github.com/Turbo87))
* [#334](https://github.com/ember-cli/eslint-plugin-ember/pull/334) package.json: Limit published files to the `lib` folder ([@Turbo87](https://github.com/Turbo87))
* [#336](https://github.com/ember-cli/eslint-plugin-ember/pull/336) CI: Use `--runInBand` option of Jest to speed up tests ([@Turbo87](https://github.com/Turbo87))

#### Committers: 2
- Garrett Murphey ([@gmurphey](https://github.com/gmurphey))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))


## v6.0.0 (2018-11-14)

This release includes several changes to the `ember/recommended` configuration,
and drops support for Node.js 4 and ESLint 3.

#### :boom: Breaking Change
* [#311](https://github.com/ember-cli/eslint-plugin-ember/pull/311) Add `avoid-using-needs-in-controllers` to recommended set. ([@rwjblue](https://github.com/rwjblue))
* [#310](https://github.com/ember-cli/eslint-plugin-ember/pull/310) Add `no-restricted-resolver-tests` to recommended. ([@rwjblue](https://github.com/rwjblue))
* [#309](https://github.com/ember-cli/eslint-plugin-ember/pull/309) Make `no-observers` rule recommended ([@Gaurav0](https://github.com/Gaurav0))
* [#274](https://github.com/ember-cli/eslint-plugin-ember/pull/274) Add `no-ember-testing-in-module-scope` to recommended ([@tmquinn](https://github.com/tmquinn))
* [#267](https://github.com/ember-cli/eslint-plugin-ember/pull/267) Remove deprecated `experimentalObjectRestSpread` option ([@scottkidder](https://github.com/scottkidder))
* [#255](https://github.com/ember-cli/eslint-plugin-ember/pull/255) Drop Node 4 support. ([@rwjblue](https://github.com/rwjblue))

#### :rocket: Enhancement
* [#311](https://github.com/ember-cli/eslint-plugin-ember/pull/311) Add `avoid-using-needs-in-controllers` to recommended set. ([@rwjblue](https://github.com/rwjblue))
* [#310](https://github.com/ember-cli/eslint-plugin-ember/pull/310) Add no-restricted-resolver-tests to recommended. ([@rwjblue](https://github.com/rwjblue))
* [#309](https://github.com/ember-cli/eslint-plugin-ember/pull/309) Make no-observers rule recommended ([@Gaurav0](https://github.com/Gaurav0))

#### Committers: 4
- Gaurav Munjal ([@Gaurav0](https://github.com/Gaurav0))
- Quinn Hoyer ([@tmquinn](https://github.com/tmquinn))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Scott Kidder ([@scottkidder](https://github.com/scottkidder))


## v5.4.0 (2018-11-09)

#### :rocket: Enhancement
* [#253](https://github.com/ember-cli/eslint-plugin-ember/pull/253) Add `avoid-using-needs` rule. ([@twokul](https://github.com/twokul))

#### :bug: Bug Fix
* [#314](https://github.com/ember-cli/eslint-plugin-ember/pull/314) Adding missing rules to index.js. ([@gmurphey](https://github.com/gmurphey))

#### Committers: 2
- Alex Navasardyan ([twokul](https://github.com/twokul))
- Garrett Murphey ([gmurphey](https://github.com/gmurphey))


## v5.3.0 (2018-11-08)

#### :rocket: Enhancement
* [#278](https://github.com/ember-cli/eslint-plugin-ember/pull/278) Adding `no-restricted-resolver-tests` general rule. ([@scalvert](https://github.com/scalvert))
* [#272](https://github.com/ember-cli/eslint-plugin-ember/pull/272) Add new rule `no-ember-testing-in-module-scope`. ([@tmquinn](https://github.com/tmquinn))
* [#261](https://github.com/ember-cli/eslint-plugin-ember/pull/261) Adding `no-test-file-importing` rule. ([@step2yeung](https://github.com/step2yeung))
* [#256](https://github.com/ember-cli/eslint-plugin-ember/pull/256) Add `no-new-mixins` rule. ([@nlfurniss](https://github.com/nlfurniss))

#### :bug: Bug Fix
* [#299](https://github.com/ember-cli/eslint-plugin-ember/pull/299) Fix issue with `no-duplicate-dependent-keys` to avoid errors on non-string dependent keys. ([@initram](https://github.com/initram))
* [#260](https://github.com/ember-cli/eslint-plugin-ember/pull/260) Updating `no-side-effects` rule to better detect sets inside of blocks. ([@gmurphey](https://github.com/gmurphey))
* [#246](https://github.com/ember-cli/eslint-plugin-ember/pull/246) Updating `no-on-calls-in-components` to only fail components using on with lifecylcle hooks. ([@patience-tema-baron](https://github.com/patience-tema-baron))

#### :memo: Documentation
* [#276](https://github.com/ember-cli/eslint-plugin-ember/pull/276) Add reason for rule `no-on-calls-in-components`. ([@cbou](https://github.com/cbou))
* [#277](https://github.com/ember-cli/eslint-plugin-ember/pull/277) docs: remove `get` from closure action example. ([@knownasilya](https://github.com/knownasilya))
* [#266](https://github.com/ember-cli/eslint-plugin-ember/pull/266) Update `no-empty-attrs` description. ([@locks](https://github.com/locks))

#### :house: Internal
* [#280](https://github.com/ember-cli/eslint-plugin-ember/pull/280) Clean up a couple of test definitions to unblock update script. ([@tmquinn](https://github.com/tmquinn))

#### Committers: 12
- Garrett Murphey ([gmurphey](https://github.com/gmurphey))
- Ilya Radchenko ([knownasilya](https://github.com/knownasilya))
- Martin Midtgaard ([initram](https://github.com/initram))
- Nathaniel Furniss ([nlfurniss](https://github.com/nlfurniss))
- Patience Tema Baron ([patience-tema-baron](https://github.com/patience-tema-baron))
- Quinn Hoyer ([tmquinn](https://github.com/tmquinn))
- Ricardo Mendes ([locks](https://github.com/locks))
- Stephen Yeung ([step2yeung](https://github.com/step2yeung))
- Steve Calvert ([scalvert](https://github.com/scalvert))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))
- [dependabot[bot]](https://github.com/apps/dependabot)
- charles bourasseau ([cbou](https://github.com/cbou))


## v5.2.0 (2018-05-15)

#### :rocket: Enhancement
* [#142](https://github.com/ember-cli/eslint-plugin-ember/pull/142) Port code to ember-rfc176-data new format. ([@Serabe](https://github.com/Serabe))
* [#245](https://github.com/ember-cli/eslint-plugin-ember/pull/245) [avoid-leaking-state-in-ember-objects] Expose default ignored properties. ([@Kerrick](https://github.com/Kerrick))

#### :memo: Documentation
* [#208](https://github.com/ember-cli/eslint-plugin-ember/pull/208) Add URL to rule documentation to the metadata. ([@Arcanemagus](https://github.com/Arcanemagus))

#### :house: Internal
* [#142](https://github.com/ember-cli/eslint-plugin-ember/pull/142) Port code to ember-rfc176-data new format. ([@Serabe](https://github.com/Serabe))

#### Committers: 3
- Kerrick Long ([Kerrick](https://github.com/Kerrick))
- Landon Abney ([Arcanemagus](https://github.com/Arcanemagus))
- Sergio Arbeo ([Serabe](https://github.com/Serabe))


## v5.1.1 (2018-05-14)

#### :bug: Bug Fix
* [#229](https://github.com/ember-cli/eslint-plugin-ember/pull/229) Fix no-capital-letters-in-routes so it deals with MemberExpressions. ([@nlfurniss](https://github.com/nlfurniss))

#### :memo: Documentation
* [#241](https://github.com/ember-cli/eslint-plugin-ember/pull/241) Removes the no-jquery doc typo. ([@thebluejay](https://github.com/thebluejay))

#### :house: Internal
* [#254](https://github.com/ember-cli/eslint-plugin-ember/pull/254) Drop require-folder-tree dependency. ([@rwjblue](https://github.com/rwjblue))
* [#242](https://github.com/ember-cli/eslint-plugin-ember/pull/242) Update `jest` to v21.2.1. ([@Turbo87](https://github.com/Turbo87))

#### Committers: 4
- Nathaniel Furniss ([nlfurniss](https://github.com/nlfurniss))
- Robert Jackson ([rwjblue](https://github.com/rwjblue))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))
- [thebluejay](https://github.com/thebluejay)


## v5.1.0 (2018-03-11)

#### :rocket: Enhancement
* [#172](https://github.com/ember-cli/eslint-plugin-ember/pull/172) Add `--fix` support to `order-in-*` rules. ([@PrzemoRevolve](https://github.com/PrzemoRevolve))

#### :bug: Bug Fix
* [#233](https://github.com/ember-cli/eslint-plugin-ember/pull/233) Fix init order in controllers and routes. ([@ro0gr](https://github.com/ro0gr))
* [#198](https://github.com/ember-cli/eslint-plugin-ember/pull/198) Add new scenarios for `require-super-in-init` rule. ([@clcuevas](https://github.com/clcuevas))
* [#205](https://github.com/ember-cli/eslint-plugin-ember/pull/205) add willInsertElement component lifecycle hook. ([@hakubo](https://github.com/hakubo))

#### Committers: 8
- Claudia Cuevas ([clcuevas](https://github.com/clcuevas))
- Jakub Olek ([hakubo](https://github.com/hakubo))
- Jason Williams ([jaswilli](https://github.com/jaswilli))
- Przemysław Nowak ([PrzemoRevolve](https://github.com/PrzemoRevolve))
- Ricardo Mendes ([locks](https://github.com/locks))
- Ruslan Grabovoy ([ro0gr](https://github.com/ro0gr))
- Sylvain MINA ([sly7-7](https://github.com/sly7-7))
- [verim1990](https://github.com/verim1990)


## v5.0.3 (2017-12-21)

#### :bug: Bug Fix
* [#197](https://github.com/ember-cli/eslint-plugin-ember/pull/197) Don't fail 'no-global-jquery' if module has both jquery and ember imports. ([@danwenzel](https://github.com/danwenzel))

#### Committers: 1
- Dan Wenzel ([danwenzel](https://github.com/danwenzel))

## v5.0.2 (2017-12-18)

#### :bug: Bug Fix
* [#186](https://github.com/ember-cli/eslint-plugin-ember/pull/186) Update `no-global-jquery` rule to account for new modules import. ([@clcuevas](https://github.com/clcuevas))

#### :memo: Documentation
* [#194](https://github.com/ember-cli/eslint-plugin-ember/pull/194) Update README.md. ([@bartocc](https://github.com/bartocc))

#### Committers: 2
- Claudia Cuevas ([clcuevas](https://github.com/clcuevas))
- Julien Palmas ([bartocc](https://github.com/bartocc))

## v5.0.1 (2017-11-20)

#### :rocket: Enhancement
* [#144](https://github.com/ember-cli/eslint-plugin-ember/pull/144) Add destructuring support to `new-modules-import` rule. ([@clcuevas](https://github.com/clcuevas))
* [#151](https://github.com/ember-cli/eslint-plugin-ember/pull/151) Allow recognition of controller injection. ([@rmachielse](https://github.com/rmachielse))

#### :bug: Bug Fix
* [#184](https://github.com/ember-cli/eslint-plugin-ember/pull/184) Prevent error when destructured path is not in known globals.. ([@rwjblue](https://github.com/rwjblue))

#### :memo: Documentation
* [#178](https://github.com/ember-cli/eslint-plugin-ember/pull/178) Add Release instructions. ([@Turbo87](https://github.com/Turbo87))
* [#167](https://github.com/ember-cli/eslint-plugin-ember/pull/167) Added Yarn Install. ([@Alonski](https://github.com/Alonski))
* [#177](https://github.com/ember-cli/eslint-plugin-ember/pull/177) Add CHANGELOG. ([@Turbo87](https://github.com/Turbo87))
* [#176](https://github.com/ember-cli/eslint-plugin-ember/pull/176) Add myself to contributors. ([@jbandura](https://github.com/jbandura))

#### Committers: 6
- Alon Bukai ([Alonski](https://github.com/Alonski))
- Claudia Cuevas ([clcuevas](https://github.com/clcuevas))
- Jacek Bandura ([jbandura](https://github.com/jbandura))
- Richard Machielse ([rmachielse](https://github.com/rmachielse))
- Robert Jackson ([rwjblue](https://github.com/rwjblue))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))
-
## v5.0.0 (2017-11-20)

* 📦 - Change `recommended` rule set to match `eslint` pattern of only including rules that prevent errors (and specifically excluding stylistic rules).
  * ❌  - Remove `alias-model-in-controller` from `ember/recommended` rule set.
  * ❌  - Remove `avoid-leaking-state-in-components` from `ember/recommended` rule set.
  * ❌  - Remove `named-functions-in-promises` from `ember/recommended` rule set.
  * ❌  - Remove `no-empty-attrs` from `ember/recommended` rule set.
  * ❌  - Remove `no-observers` from `ember/recommended` rule set.
  * ❌  - Remove `use-ember-get-and-set` from `ember/recommended` rule set.
  * ❌  - Remove `order-in-components` from `ember/recommended` rule set.
  * ❌  - Remove `order-in-controllers` from `ember/recommended` rule set.
  * ❌  - Remove `order-in-models` from `ember/recommended` rule set.
  * ❌  - Remove `order-in-routes` from `ember/recommended` rule set.
  * ✅  - Add `avoid-leaking-state-in-ember-objects` to `ember/recommended` rule set.
  * ✅  - Add `new-module-imports` to `ember/recommended` rule set.
  * ✅  - Add `no-attrs-in-components` to `ember/recommended` rule set.
  * ✅  - Add `no-duplicate-dependent-keys` from `ember/recommended` rule set.
  * ✅  - Add `no-global-jquery` to `ember/recommended` rule set.
  * ✅  - Add `no-old-shims` to `ember/recommended` rule set.
  * ✅  - Add `require-super-in-init` to `ember/recommended` rule set.

#### :boom: Breaking Change
* [#173](https://github.com/ember-cli/eslint-plugin-ember/pull/173) Disable `order-in-*` rules by default. ([@Turbo87](https://github.com/Turbo87))
* [#174](https://github.com/ember-cli/eslint-plugin-ember/pull/174) Disable and deprecate `avoid-leaking-state-in-components` rule. ([@Turbo87](https://github.com/Turbo87))
* [#146](https://github.com/ember-cli/eslint-plugin-ember/pull/146) Update configs and recommendations. ([@michalsnik](https://github.com/michalsnik))

#### :rocket: Enhancement
* [#144](https://github.com/ember-cli/eslint-plugin-ember/pull/144) Add destructuring support to `new-modules-import` rule. ([@clcuevas](https://github.com/clcuevas))
* [#151](https://github.com/ember-cli/eslint-plugin-ember/pull/151) Allow recognition of controller injection. ([@rmachielse](https://github.com/rmachielse))

#### :memo: Documentation
* [#178](https://github.com/ember-cli/eslint-plugin-ember/pull/178) Add Release instructions. ([@Turbo87](https://github.com/Turbo87))
* [#167](https://github.com/ember-cli/eslint-plugin-ember/pull/167) Added Yarn Install. ([@Alonski](https://github.com/Alonski))
* [#177](https://github.com/ember-cli/eslint-plugin-ember/pull/177) Add CHANGELOG. ([@Turbo87](https://github.com/Turbo87))
* [#176](https://github.com/ember-cli/eslint-plugin-ember/pull/176) Add myself to contributors. ([@jbandura](https://github.com/jbandura))

#### Committers: 9
- Alon Bukai ([Alonski](https://github.com/Alonski))
- Claudia Cuevas ([clcuevas](https://github.com/clcuevas))
- Jacek Bandura ([jbandura](https://github.com/jbandura))
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))
- Richard Machielse ([rmachielse](https://github.com/rmachielse))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))


## v4.6.2 (2017-11-15)

#### :rocket: Enhancement
* [#173](https://github.com/ember-cli/eslint-plugin-ember/pull/173) Disable `order-in-*` rules by default. ([@Turbo87](https://github.com/Turbo87))
* [#155](https://github.com/ember-cli/eslint-plugin-ember/pull/155) ember-get-and-set Add option `ignoreThisExpressions`. ([@JoelWAnna](https://github.com/JoelWAnna))
* [#174](https://github.com/ember-cli/eslint-plugin-ember/pull/174) Disable and deprecate `avoid-leaking-state-in-components` rule. ([@Turbo87](https://github.com/Turbo87))
* [#146](https://github.com/ember-cli/eslint-plugin-ember/pull/146) Update configs and recommendations. ([@michalsnik](https://github.com/michalsnik))

#### :bug: Bug Fix
* [#169](https://github.com/ember-cli/eslint-plugin-ember/pull/169) Closes [#150](https://github.com/ember-cli/eslint-plugin-ember/issues/150) issue with 'init' property. ([@eskab](https://github.com/eskab))
* [#168](https://github.com/ember-cli/eslint-plugin-ember/pull/168) Fix lint rule crash when variable is used as routename. ([@cspanring](https://github.com/cspanring))
* [#152](https://github.com/ember-cli/eslint-plugin-ember/pull/152) Detect models based on their files' path. ([@rmachielse](https://github.com/rmachielse))

#### :memo: Documentation
* [#175](https://github.com/ember-cli/eslint-plugin-ember/pull/175) Add deprecations to README. ([@Turbo87](https://github.com/Turbo87))
* [#166](https://github.com/ember-cli/eslint-plugin-ember/pull/166) add missing "plugins" and reorder. ([@kellyselden](https://github.com/kellyselden))

#### :house: Internal
* [#171](https://github.com/ember-cli/eslint-plugin-ember/pull/171) Fix failing tests on windows due to path separators. ([@PrzemoRevolve](https://github.com/PrzemoRevolve))

#### Committers: 9
- Christian Spanring ([cspanring](https://github.com/cspanring))
- Kelly Selden ([kellyselden](https://github.com/kellyselden))
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))
- Przemysław Nowak ([PrzemoRevolve](https://github.com/PrzemoRevolve))
- Richard Machielse ([rmachielse](https://github.com/rmachielse))
- Szymon Kabelis ([eskab](https://github.com/eskab))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))
- [JoelWAnna](https://github.com/JoelWAnna)
- [shegupta](https://github.com/shegupta)


## v4.6.1 (2017-11-06)

#### :bug: Bug Fix
* [#160](https://github.com/ember-cli/eslint-plugin-ember/pull/160) ignore tagged templates for avoid-leaking-state-in-ember-objects rule. ([@amk221](https://github.com/amk221))

#### Committers: 1
- Andrew Kirwin ([amk221](https://github.com/amk221))


## v4.6.0 (2017-11-03)

#### :rocket: Enhancement
* [#137](https://github.com/ember-cli/eslint-plugin-ember/pull/137) Enforce component lifecycle hook order. ([@rwwagner90](https://github.com/rwwagner90))

#### :memo: Documentation
* [#154](https://github.com/ember-cli/eslint-plugin-ember/pull/154) Add myself to contributors, use https for GitHub links. ([@rwwagner90](https://github.com/rwwagner90))
* [#153](https://github.com/ember-cli/eslint-plugin-ember/pull/153) minor typo in readme. ([@zkrzyzanowski](https://github.com/zkrzyzanowski))

#### Committers: 3
- Robert Wagner ([rwwagner90](https://github.com/rwwagner90))
- Zach Krzyzanowski ([zkrzyzanowski](https://github.com/zkrzyzanowski))
- [shegupta](https://github.com/shegupta)


## v4.5.0 (2017-09-02)

#### :rocket: Enhancement
* [#121](https://github.com/ember-cli/eslint-plugin-ember/pull/121) Add rule to disallow `this.$` to prepare apps to remove jQuery. ([@cibernox](https://github.com/cibernox))

#### Committers: 1
- Miguel Camba ([cibernox](https://github.com/cibernox))


## v4.4.0 (2017-09-02)

#### :rocket: Enhancement
* [#124](https://github.com/ember-cli/eslint-plugin-ember/pull/124) Order beforeModel and afterModel around model. ([@rwwagner90](https://github.com/rwwagner90))
* [#108](https://github.com/ember-cli/eslint-plugin-ember/pull/108) Add additional position for empty methods. ([@t-sauer](https://github.com/t-sauer))

#### :bug: Bug Fix
* [#132](https://github.com/ember-cli/eslint-plugin-ember/pull/132) Don't report on Ember method calls in use-ember-get-and-set. ([@sudowork](https://github.com/sudowork))

#### :house: Internal
* [#133](https://github.com/ember-cli/eslint-plugin-ember/pull/133) Add recommended rules snapshot test. ([@Turbo87](https://github.com/Turbo87))

#### Committers: 4
- Kevin Gao ([sudowork](https://github.com/sudowork))
- Robert Wagner ([rwwagner90](https://github.com/rwwagner90))
- Thomas Sauer ([t-sauer](https://github.com/t-sauer))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))


## v4.3.0 (2017-08-15)

#### :rocket: Enhancement
* [#104](https://github.com/ember-cli/eslint-plugin-ember/pull/104) New rule: no-duplicate-dependent-keys. ([@jbandura](https://github.com/jbandura))
* [#122](https://github.com/ember-cli/eslint-plugin-ember/pull/122) Add new "call-super-in-init" rule. ([@kevinkucharczyk](https://github.com/kevinkucharczyk))

#### :bug: Bug Fix
* [#107](https://github.com/ember-cli/eslint-plugin-ember/pull/107) Don't suggest nested property brace expansion. ([@Kerrick](https://github.com/Kerrick))

#### :memo: Documentation
* [#125](https://github.com/ember-cli/eslint-plugin-ember/pull/125) named-functions-in-promises example without .bind(). ([@caseywatts](https://github.com/caseywatts))
* [#120](https://github.com/ember-cli/eslint-plugin-ember/pull/120) Fix broken links in readme. ([@dustinspecker](https://github.com/dustinspecker))

#### :house: Internal
* [#118](https://github.com/ember-cli/eslint-plugin-ember/pull/118) Update "ember-rfc176-data" to v0.2.7. ([@Turbo87](https://github.com/Turbo87))

#### Committers: 6
- Casey Watts ([caseywatts](https://github.com/caseywatts))
- Dustin Specker ([dustinspecker](https://github.com/dustinspecker))
- Jacek Bandura ([jbandura](https://github.com/jbandura))
- Kerrick Long ([Kerrick](https://github.com/Kerrick))
- Kevin Kucharczyk ([kevinkucharczyk](https://github.com/kevinkucharczyk))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))


## v4.2.0 (2017-08-03)

#### :rocket: Enhancement
* [#115](https://github.com/ember-cli/eslint-plugin-ember/pull/115) Add `fix` for `use-ember-get-and-set`. ([@sudowork](https://github.com/sudowork))
* [#116](https://github.com/ember-cli/eslint-plugin-ember/pull/116) Add "new-module-imports" rule. ([@Turbo87](https://github.com/Turbo87))

#### :house: Internal
* [#117](https://github.com/ember-cli/eslint-plugin-ember/pull/117) CI: Publish tags to npm automatically. ([@Turbo87](https://github.com/Turbo87))

#### Committers: 2
- Kevin Gao ([sudowork](https://github.com/sudowork))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))


## v4.1.3 (2017-08-01)

#### :bug: Bug Fix
* [#114](https://github.com/ember-cli/eslint-plugin-ember/pull/114) Fix "no-global-jquery". ([@michalsnik](https://github.com/michalsnik))

#### Committers: 1
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))


## v4.1.1 (2017-08-01)

#### :rocket: Enhancement
* [#103](https://github.com/ember-cli/eslint-plugin-ember/pull/103) New rule: no-global-jquery. ([@jbandura](https://github.com/jbandura))
* [#100](https://github.com/ember-cli/eslint-plugin-ember/pull/100) New rule: no-attrs (Closes [#52](https://github.com/ember-cli/eslint-plugin-ember/issues/52)). ([@jbandura](https://github.com/jbandura))
* [#99](https://github.com/ember-cli/eslint-plugin-ember/pull/99) Adding new rule: no-attrs-snapshot. ([@scalvert](https://github.com/scalvert))

#### :bug: Bug Fix
* [#111](https://github.com/ember-cli/eslint-plugin-ember/pull/111) Add solution for service ordering when new module imports used. ([@jbandura](https://github.com/jbandura))
* [#98](https://github.com/ember-cli/eslint-plugin-ember/pull/98) Detecting computed properties with MemberExpressions. ([@jbandura](https://github.com/jbandura))

#### :memo: Documentation
* [#101](https://github.com/ember-cli/eslint-plugin-ember/pull/101) netguru -> ember-cli. ([@rwwagner90](https://github.com/rwwagner90))
* [#92](https://github.com/ember-cli/eslint-plugin-ember/pull/92) Update README & introduce auto generated table with rules. ([@michalsnik](https://github.com/michalsnik))

#### Committers: 4
- Jacek Bandura ([jbandura](https://github.com/jbandura))
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))
- Robert Wagner ([rwwagner90](https://github.com/rwwagner90))
- Steve Calvert ([scalvert](https://github.com/scalvert))


## v3.6.2 (2017-07-13)

#### :bug: Bug Fix
* [#93](https://github.com/ember-cli/eslint-plugin-ember/pull/93) Make sure negative values are treated as properties. ([@jbandura](https://github.com/jbandura))

#### Committers: 1
- Jacek Bandura ([jbandura](https://github.com/jbandura))


## v3.6.1 (2017-07-11)

#### :bug: Bug Fix
* [#94](https://github.com/ember-cli/eslint-plugin-ember/pull/94) Fix method of detecting whether route segment present. ([@jbandura](https://github.com/jbandura))

#### Committers: 1
- Jacek Bandura ([jbandura](https://github.com/jbandura))


## v3.6.0 (2017-07-10)

#### :rocket: Enhancement
* [#90](https://github.com/ember-cli/eslint-plugin-ember/pull/90) Add new "no-old-shims" rule. ([@Turbo87](https://github.com/Turbo87))

#### :house: Internal
* [#91](https://github.com/ember-cli/eslint-plugin-ember/pull/91) Switch test runner from Mocha/Chai to Jest. ([@Turbo87](https://github.com/Turbo87))
* [#89](https://github.com/ember-cli/eslint-plugin-ember/pull/89) Update "yarn.lock" file. ([@Turbo87](https://github.com/Turbo87))

#### Committers: 1
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))


## v3.5.0 (2017-06-26)

#### :rocket: Enhancement
* [#80](https://github.com/ember-cli/eslint-plugin-ember/pull/80) alias-model-in-controller: allow nested properties. ([@buschtoens](https://github.com/buschtoens))
* [#77](https://github.com/ember-cli/eslint-plugin-ember/pull/77) Add no-capital-letters-in-routes to base. ([@scottkidder](https://github.com/scottkidder))

#### Committers: 2
- Jan Buschtöns ([buschtoens](https://github.com/buschtoens))
- Scott Kidder ([scottkidder](https://github.com/scottkidder))


## v3.4.1 (2017-05-30)

#### :bug: Bug Fix
* [#74](https://github.com/ember-cli/eslint-plugin-ember/pull/74) Revert "Make it available on emberobserver.com". ([@Turbo87](https://github.com/Turbo87))

#### Committers: 1
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))


## v3.4.0 (2017-05-27)

#### :rocket: Enhancement
* [#70](https://github.com/ember-cli/eslint-plugin-ember/pull/70) New rule: no-capital-letters-in-routes. ([@michalsnik](https://github.com/michalsnik))

#### Committers: 1
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))


## v3.3.0 (2017-05-24)

#### :rocket: Enhancement
* [#64](https://github.com/ember-cli/eslint-plugin-ember/pull/64) Allow concise ArrowFunctionExpression (named-functions-in-promises). ([@sudowork](https://github.com/sudowork))
* [#66](https://github.com/ember-cli/eslint-plugin-ember/pull/66) Support tagged templates expressions. ([@michalsnik](https://github.com/michalsnik))

#### :memo: Documentation
* [#43](https://github.com/ember-cli/eslint-plugin-ember/pull/43) Sync groups between desc and javascript snippet. ([@bartocc](https://github.com/bartocc))
* [#65](https://github.com/ember-cli/eslint-plugin-ember/pull/65) Don't use this.attrs in docs. ([@sudowork](https://github.com/sudowork))

#### Committers: 3
- Julien Palmas ([bartocc](https://github.com/bartocc))
- Kevin Gao ([sudowork](https://github.com/sudowork))
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))


## v3.2.0 (2017-05-23)

#### :rocket: Enhancement
* [#60](https://github.com/ember-cli/eslint-plugin-ember/pull/60) `alias-model-in-controller` should support `readOnly` and `reads`. ([@michalsnik](https://github.com/michalsnik))
* [#46](https://github.com/ember-cli/eslint-plugin-ember/pull/46) Fix typo in documentation: rename 'no-side-effect' to 'no-side-effects'. ([@RusPosevkin](https://github.com/RusPosevkin))

#### :memo: Documentation
* [#50](https://github.com/ember-cli/eslint-plugin-ember/pull/50) Add syntax highlighting to Readme. ([@ryanponce](https://github.com/ryanponce))
* [#49](https://github.com/ember-cli/eslint-plugin-ember/pull/49) Update docs. ([@michalsnik](https://github.com/michalsnik))

#### :house: Internal
* [#54](https://github.com/ember-cli/eslint-plugin-ember/pull/54) Update rules to new ESLint rule format. ([@SaladFork](https://github.com/SaladFork))

#### Committers: 4
- Elad Shahar ([SaladFork](https://github.com/SaladFork))
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))
- Ruslan Posevkin ([RusPosevkin](https://github.com/RusPosevkin))
- Ryan Ponce ([ryanponce](https://github.com/ryanponce))


## v3.1.2 (2017-03-24)

#### :rocket: Enhancement
* [#44](https://github.com/ember-cli/eslint-plugin-ember/pull/44) Update no-on-calls-in-components rule. ([@clcuevas](https://github.com/clcuevas))

#### :memo: Documentation
* [#40](https://github.com/ember-cli/eslint-plugin-ember/pull/40) Fix configuration key. ([@bdmac](https://github.com/bdmac))

#### Committers: 2
- Brian McManus ([bdmac](https://github.com/bdmac))
- Claudia Cuevas ([clcuevas](https://github.com/clcuevas))


## v3.1.1 (2017-03-16)

#### :rocket: Enhancement
* [#39](https://github.com/ember-cli/eslint-plugin-ember/pull/39) Update no-empty-attrs rule. ([@clcuevas](https://github.com/clcuevas))

#### Committers: 1
- Claudia Cuevas ([clcuevas](https://github.com/clcuevas))


## v3.1.0 (2017-03-16)

#### :rocket: Enhancement
* [#37](https://github.com/ember-cli/eslint-plugin-ember/pull/37) 27 / Detect module types based on their files' path. ([@michalsnik](https://github.com/michalsnik))

#### Committers: 1
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))


## v3.0.2 (2017-03-08)

#### :rocket: Enhancement
* [#38](https://github.com/ember-cli/eslint-plugin-ember/pull/38) Add functions to route order. ([@netes](https://github.com/netes))

#### :memo: Documentation
* [#35](https://github.com/ember-cli/eslint-plugin-ember/pull/35) Typo in docs / closure-actions.md. ([@nfc036](https://github.com/nfc036))
* [#36](https://github.com/ember-cli/eslint-plugin-ember/pull/36) Remove remaining references to "query-params-on-top" rule. ([@Turbo87](https://github.com/Turbo87))

#### Committers: 3
- Kamil Ejsymont ([netes](https://github.com/netes))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))
- [nfc036](https://github.com/nfc036)


## v3.0.0 (2017-02-20)

#### :rocket: Enhancement
* [#34](https://github.com/ember-cli/eslint-plugin-ember/pull/34) Improve order in controllers and documentation. ([@michalsnik](https://github.com/michalsnik))

#### :house: Internal
* [#33](https://github.com/ember-cli/eslint-plugin-ember/pull/33) Add eslint and use ES6. ([@michalsnik](https://github.com/michalsnik))

#### Committers: 1
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))


## v2.2.2 (2017-02-15)

#### :rocket: Enhancement
* [#31](https://github.com/ember-cli/eslint-plugin-ember/pull/31) Treat conditional expressions as custom properties. ([@michalsnik](https://github.com/michalsnik))

#### Committers: 1
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))


## v2.2.1 (2017-02-15)

#### :bug: Bug Fix
* [#30](https://github.com/ember-cli/eslint-plugin-ember/pull/30) Check only model's properties against `no-empty-attrs` rule. ([@michalsnik](https://github.com/michalsnik))

#### Committers: 1
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))


## v2.2.0 (2017-02-14)

#### :rocket: Enhancement
* [#23](https://github.com/ember-cli/eslint-plugin-ember/pull/23) Improved error messages for `order-in` rules. ([@Turbo87](https://github.com/Turbo87))

#### Committers: 1
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))


## v2.1.1 (2017-02-07)

#### :bug: Bug Fix
* [#16](https://github.com/ember-cli/eslint-plugin-ember/pull/16) Fix named-functions-in-promises rule. ([@michalsnik](https://github.com/michalsnik))

#### :memo: Documentation
* [#22](https://github.com/ember-cli/eslint-plugin-ember/pull/22) name correction. ([@bcardarella](https://github.com/bcardarella))

#### Committers: 2
- Brian Cardarella ([bcardarella](https://github.com/bcardarella))
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))


## v2.1.0 (2017-02-05)

#### :rocket: Enhancement
* [#15](https://github.com/ember-cli/eslint-plugin-ember/pull/15) Report correct positions for "order-in-*" rules. ([@Turbo87](https://github.com/Turbo87))

#### :memo: Documentation
* [#20](https://github.com/ember-cli/eslint-plugin-ember/pull/20) Update README and contributors. ([@michalsnik](https://github.com/michalsnik))
* [#12](https://github.com/ember-cli/eslint-plugin-ember/pull/12) doc: Adjust `no-side-effects` name and link. ([@Turbo87](https://github.com/Turbo87))
* [#7](https://github.com/ember-cli/eslint-plugin-ember/pull/7) README: Remove `ember-cli-eslint` requirement. ([@bardzusny](https://github.com/bardzusny))

#### :house: Internal
* [#19](https://github.com/ember-cli/eslint-plugin-ember/pull/19) Describe, launch tests under all supported Node.js versions. ([@bardzusny](https://github.com/bardzusny))
* [#9](https://github.com/ember-cli/eslint-plugin-ember/pull/9) Disable nyan reporter in CI. ([@alexlafroscia](https://github.com/alexlafroscia))
* [#8](https://github.com/ember-cli/eslint-plugin-ember/pull/8) Match yeoman generator structure. ([@alexlafroscia](https://github.com/alexlafroscia))
* [#4](https://github.com/ember-cli/eslint-plugin-ember/pull/4) Chore / Update plugin environment. ([@michalsnik](https://github.com/michalsnik))

#### Committers: 4
- Adrian ([bardzusny](https://github.com/bardzusny))
- Alex LaFroscia ([alexlafroscia](https://github.com/alexlafroscia))
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))


## v2.0.1 (2017-01-16)

#### :bug: Bug Fix
* [#3](https://github.com/ember-cli/eslint-plugin-ember/pull/3) Fix error in 'use-brace-expansion' rule. ([@dwickern](https://github.com/dwickern))

#### Committers: 1
- Derek Wickern ([dwickern](https://github.com/dwickern))


## v2.0.0 (2016-12-30)

#### :rocket: Enhancement
* [#1](https://github.com/ember-cli/eslint-plugin-ember/pull/1) Add base configurations. ([@michalsnik](https://github.com/michalsnik))
* [#34](https://github.com/ember-cli/eslint-plugin-ember/pull/34) Improve order in controllers and documentation. ([@michalsnik](https://github.com/michalsnik))
* [#37](https://github.com/ember-cli/eslint-plugin-ember/pull/37) 27 / Detect module types based on their files' path. ([@michalsnik](https://github.com/michalsnik))
* [#31](https://github.com/ember-cli/eslint-plugin-ember/pull/31) Treat conditional expressions as custom properties. ([@michalsnik](https://github.com/michalsnik))
* [#23](https://github.com/ember-cli/eslint-plugin-ember/pull/23) Improved error messages for `order-in` rules. ([@Turbo87](https://github.com/Turbo87))
* [#15](https://github.com/ember-cli/eslint-plugin-ember/pull/15) Report correct positions for "order-in-*" rules. ([@Turbo87](https://github.com/Turbo87))

#### :bug: Bug Fix
* False positive for `no-empty-attrs`. ([@bdmac](https://github.com/bdmac))
* order-in-controllers vs query-params-on-top. ([@michalsnik](https://github.com/michalsnik))
* [#16](https://github.com/ember-cli/eslint-plugin-ember/pull/16) Fix named-functions-in-promises rule. ([@michalsnik](https://github.com/michalsnik))

#### :memo: Documentation
* [#35](https://github.com/ember-cli/eslint-plugin-ember/pull/35) Typo in docs / closure-actions.md. ([@nfc036](https://github.com/nfc036))
* [#22](https://github.com/ember-cli/eslint-plugin-ember/pull/22) name correction. ([@bcardarella](https://github.com/bcardarella))
* [#20](https://github.com/ember-cli/eslint-plugin-ember/pull/20) Update README and contributors. ([@michalsnik](https://github.com/michalsnik))

#### :house: Internal
* [#33](https://github.com/ember-cli/eslint-plugin-ember/pull/33) Add eslint and use ES6. ([@michalsnik](https://github.com/michalsnik))
* [#19](https://github.com/ember-cli/eslint-plugin-ember/pull/19) Describe, launch tests under all supported Node.js versions. ([@bardzusny](https://github.com/bardzusny))
* [#4](https://github.com/ember-cli/eslint-plugin-ember/pull/4) Chore / Update plugin environment. ([@michalsnik](https://github.com/michalsnik))

#### Committers: 9
- Adrian ([bardzusny](https://github.com/bardzusny))
- Brian Cardarella ([bcardarella](https://github.com/bcardarella))
- Brian McManus ([bdmac](https://github.com/bdmac))
- Craig Bilner ([craigbilner](https://github.com/craigbilner))
- Kamil Ejsymont ([netes](https://github.com/netes))
- Marcin Horoszko ([cinkonaap](https://github.com/cinkonaap))
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))
- [nfc036](https://github.com/nfc036)
