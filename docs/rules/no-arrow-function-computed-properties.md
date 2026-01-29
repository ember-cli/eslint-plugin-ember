# ember/no-arrow-function-computed-properties

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

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
  }),
});
```

Examples of **correct** code for this rule:

```js
import EmberObject, { computed } from '@ember/object';

const Person = EmberObject.extend({
  fullName: computed('firstName', 'lastName', function () {
    return `${this.firstName} ${this.lastName}`;
  }),
});
```

## Configuration

<!-- begin auto-generated rule options list -->

| Name               | Description                                                                                                                      | Type    | Default |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------- | :------ | :------ |
| `onlyThisContexts` | Whether the rule should allow or disallow computed properties where the arrow function body does not contain a `this` reference. | Boolean | `false` |

<!-- end auto-generated rule options list -->

## References

- [Arrow function spec](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [Computed property spec](https://api.emberjs.com/ember/release/classes/ComputedProperty)
