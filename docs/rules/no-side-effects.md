# no-side-effects

Don't introduce side-effects in computed properties.

When using computed properties do not introduce side effects. It will make reasoning about the origin of the change much harder.

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
    this.set('fifteenAmount', fifteen.length); // SIDE EFFECT!
    return fifteen;
  })
});
```

## Help Wanted

| Issue | Link |
| :-- | :-- |
| :x: Missing native JavaScript class support | [#560](https://github.com/ember-cli/eslint-plugin-ember/issues/560) |
