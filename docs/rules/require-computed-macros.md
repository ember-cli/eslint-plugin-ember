# require-computed-macros

:white_check_mark: The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

:wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

It is preferred to use Ember's computed property macros as opposed to manually writing out logic in a computed property function. Reasons include:

* Conciseness
* Readability
* Reduced chance of typos
* Reduced chance of missing dependencies

Note that by default, this rule only applies in classic classes (i.e. `Component.extend({})`) and not in native JavaScript classes with decorators (read more about the `includeNativeGetters` option in the configuration section of this doc).

## Rule Details

This rule requires using Ember's computed property macros when possible.

## Examples

Examples of **incorrect** code for this rule:

```js
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  propReads: computed('x', function () {
    return this.x;
  }),

  propAnd: computed('x', 'y', function () {
    return this.x && this.y;
  }),

  propOr: computed('x', 'y', function () {
    return this.x || this.y;
  }),

  propGt: computed('x', function () {
    return this.x > 123;
  }),

  propGte: computed('x', function () {
    return this.x >= 123;
  }),

  propLt: computed('x', function () {
    return this.x < 123;
  }),

  propLte: computed('x', function () {
    return this.x <= 123;
  }),

  propNot: computed('x', function () {
    return !this.x;
  }),

  propEqual: computed('x', function () {
    return this.x === 123;
  }),

  propFilterBy: computed('chores.@each.done', function () {
    return this.chores.filterBy('done', true);
  }),

  propMapBy: computed('children.@each.age', function () {
    return this.children.mapBy('age');
  })
});
```

Examples of **correct** code for this rule:

```js
import Component from '@ember/component';
import {
  reads,
  and,
  or,
  gt,
  gte,
  lt,
  lte,
  not,
  equal,
  filterBy,
  mapBy
} from '@ember/object/computed';

export default Component.extend({
  propReads: reads('x'),

  propAnd: and('x', 'y'),

  propOr: or('x', 'y'),

  propGt: gt('x', 123),

  propGte: gte('x', 123),

  propLt: lt('x', 123),

  propLte: lte('x', 123),

  propNot: not('x'),

  propEqual: equal('x', 123),

  propFilterBy: filterBy('chores', 'done', true),

  propMapBy: mapBy('children', 'age')
});
```

## Configuration

This rule takes an optional object containing:

* `boolean` -- `includeNativeGetters` -- whether the rule should check and autofix computed properties with native getters (i.e. `@computed() get someProp() {}`) to use computed property macros (default `false`). This is off by default because in the Ember Octane world, the better improvement would be to keep the native getter and use tracked properties instead of computed properties.

## References

* [Guide](https://guides.emberjs.com/release/object-model/computed-properties/) for computed properties
* [Spec](http://api.emberjs.com/ember/release/modules/@ember%2Fobject#functions-computed) for computed property macros

## Related Rules

* [no-incorrect-computed-macros](no-incorrect-computed-macros.md)
