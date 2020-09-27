# no-side-effects

:white_check_mark: The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

When using computed properties, do not introduce side effects. Side effects make it much more difficult to reason about the origin of changes.

This rule currently disallows the following side-effect-causing statements inside computed properties:

* `this.set('x', 123);`
* `this.setProperties({ x: 123 });`
* `this.x = 123;`

Note that other side effects like network requests should be avoided as well.

## Examples

```javascript
import Component from '@ember/component';
import { alias, filterBy } from '@ember/object/computed';

export default Component.extend({
  init(...args) {
    this.users = [
      { name: 'Foo', age: 15 },
      { name: 'Bar', age: 16 },
      { name: 'Baz', age: 15 }
    ];
    this._super(...args);
  },

  // GOOD:
  fifteenGood: filterBy('users', 'age', 15),
  fifteenAmountGood: alias('fifteen.length'),

  // BAD:
  fifteenAmountBad: 0,
  fifteenBad: computed('users', function () {
    const fifteen = this.users.filterBy('items', 'age', 15);
    this.set('fifteenAmountBad', fifteen.length); // SIDE EFFECT!
    return fifteen;
  })
});
```

## Configuration

This rule takes an optional object containing:

* `boolean` -- `catchEvents` -- whether the rule should catch function calls that send actions or events (default `true`)
* `boolean` -- `checkPlainGetters` -- whether the rule should check plain (non-computed) getters in native classes for side effects (default `false`, TODO: change default to `true` in next major release)
