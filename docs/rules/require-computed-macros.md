# require-computed-macros

:wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

It is preferred to use Ember's computed property macros as opposed to manually writing out logic in a computed property function. Reasons include:

* Conciseness
* Readability
* Reduced chance of typos
* Reduced chance of missing dependencies

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
  })
});
```

Examples of **correct** code for this rule:

```js
import Component from '@ember/component';
import { reads, and, or, gt, gte, lt, lte, not, equal } from '@ember/object/computed';

export default Component.extend({
  propReads: reads('x'),

  propAnd: and('x', 'y'),

  propOr: or('x', 'y'),

  propGt: gt('x', 123),

  propGte: gte('x', 123),

  propLt: lt('x', 123),

  propLte: lte('x', 123),

  propNot: not('x'),

  propEqual: equal('x', 123)
});
```

## References

* [Guide](https://guides.emberjs.com/release/object-model/computed-properties/) for computed properties
* [Spec](http://api.emberjs.com/ember/release/modules/@ember%2Fobject#functions-computed) for computed property macros

## Related Rules

* [no-incorrect-computed-macros](no-incorrect-computed-macros.md)

## Help Wanted

| Issue | Link |
| :-- | :-- |
| :x: Missing native JavaScript class support | [#560](https://github.com/ember-cli/eslint-plugin-ember/issues/560) |
