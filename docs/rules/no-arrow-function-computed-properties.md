# no-arrow-function-computed-properties

Arrow functions should not be used in computed properties because they are unable to access other properties (using `this.property`) of the same object. Accidental usage can thus lead to bugs.

## Rule Details

This rule disallows using arrow functions in computed properties.

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
* [Computed property spec](https://api.emberjs.com/ember/release/classes/ComputedProperty)
