# no-computed-properties-in-native-classes



## Rule Details



## Examples

Examples of **incorrect** code for this rule:

```js
import EmberObject, { computed } from '@ember/object';

const Person = EmberObject.extend({
  fullName: computed('firstName', 'lastName', () => {
    return `${this.firstName} ${this.lastName}`;
  })
});
```

Examples of **correct** code for this rule:

```js
import EmberObject, { computed } from '@ember/object';

const Person = EmberObject.extend({
  fullName: computed('firstName', 'lastName', function() {
    return `${this.firstName} ${this.lastName}`;
  })
});
```

## References

* [Arrow function spec](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
