## Don't introduce side-effects in computed properties

### Rule name: `no-side-effect`

When using computed properties do not introduce side effects. It will make reasoning about the origin of the change much harder.

```javascript
import Ember from 'ember';

const {
  Component,
  computed: { filterBy, alias },
} = Ember;

export default Component.extend({
  users: [
    { name: 'Foo', age: 15 },
    { name: 'Bar', age: 16 },
    { name: 'Baz', age: 15 }
  ],

  // GOOD:
  fifteen: filterBy('users', 'age', 15),
  fifteenAmount: alias('fifteen.length'),

  // BAD:
  fifteenAmount: 0,
  fifteen: computed('users', function() {
    const fifteen = this.get('users').filterBy('items', 'age', 15);
    this.set('fifteenAmount', fifteen.length); // SIDE EFFECT!
    return fifteen;
  })
});
```
