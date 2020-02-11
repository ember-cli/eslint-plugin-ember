# require-computed-property-dependencies

Computed properties should have their property dependencies listed out so that they can recompute upon changes.

## Rule Details

This rule requires dependencies to be declared statically in computed properties. Properties accessed within the computed property function that are not listed out are assumed to be missing dependencies. Various forms of accessing properties will be detected including:

* `this.get('property')`
* `this.getProperties('a', 'b')`
* `Ember.get(this, 'property')`
* `this.property` (ES5 getter)

This rule has an autofixer that will automatically add missing dependencies to computed properties.

## Examples

Examples of **incorrect** code for this rule:

```js
import EmberObject, { computed } from '@ember/object';

export default EmberObject.extend({
  name: computed(function() {
    return `${this.firstName} ${this.lastName}`;
  })
});
```

Examples of **correct** code for this rule:

```js
import EmberObject, { computed } from '@ember/object';

export default EmberObject.extend({
  name: computed('firstName', 'lastName', function() {
    return `${this.firstName} ${this.lastName}`;
  })
});
```

## Configuration

This rule takes an optional object containing:

* `boolean` -- `allowDynamicKeys` -- whether the rule should allow or disallow dynamic (variable / non-string) dependency keys in computed properties (default `true`)
* `boolean` -- `requireServiceNames` -- whether the rule should require injected service names to be listed as dependency keys in computed properties (default `false`)

## References

* [Guide](https://guides.emberjs.com/release/object-model/computed-properties/) for computed properties
