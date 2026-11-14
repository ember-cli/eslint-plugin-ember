# ember/require-computed-property-dependencies

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Computed properties should have their property dependencies listed out so that they can recompute upon changes.

## Rule Details

This rule requires dependencies to be declared statically in computed properties. Properties accessed within the computed property function that are not listed out are assumed to be missing dependencies. Various forms of accessing properties will be detected including:

- `this.get('property')`
- `this.getProperties('a', 'b')`
- `Ember.get(this, 'property')`
- `this.property` (ES5 getter)

This rule has an autofixer that will automatically add missing dependencies to computed properties.

Dependent keys passed in a variable, like `computed(KEY, ...)` or `computed(...KEYS, ...)`, are used when their value is known statically, such as a `const` string or array of strings (also through `Object.freeze()`). Other variables are treated as unknown keys.

## Examples

Examples of **incorrect** code for this rule:

```js
import EmberObject, { computed } from '@ember/object';

export default EmberObject.extend({
  name: computed(function () {
    return `${this.firstName} ${this.lastName}`;
  }),
});
```

Examples of **correct** code for this rule:

```js
import EmberObject, { computed } from '@ember/object';

export default EmberObject.extend({
  name: computed('firstName', 'lastName', function () {
    return `${this.firstName} ${this.lastName}`;
  }),
});
```

## Configuration

<!-- begin auto-generated rule options list -->

| Name                  | Description                                                                                                       | Type    | Default |
| :-------------------- | :---------------------------------------------------------------------------------------------------------------- | :------ | :------ |
| `allowDynamicKeys`    | Whether the rule should allow or disallow dynamic (variable / non-string) dependency keys in computed properties. | Boolean | `true`  |
| `requireServiceNames` | Whether the rule should require injected service names to be listed as dependency keys in computed properties.    | Boolean | `false` |

<!-- end auto-generated rule options list -->

## References

- [Guide](https://guides.emberjs.com/release/object-model/computed-properties/) for computed properties
