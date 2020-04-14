# no-volatile-computed-properties

:white_check_mark: The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

Volatile computed properties are deprecated as of Ember 3.9.

## Rule Details

This rule disallows using volatile computed properties.

## Examples

Examples of **incorrect** code for this rule:

```js
const Person = EmberObject.extend({
  fullName: computed(function () {
    return `${this.firstName} ${this.lastName}`;
  }).volatile()
});
```

Examples of **correct** code for this rule:

```js
const Person = EmberObject.extend({
  // Native getter:
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
});
```

## References

* [Deprecation RFC](https://github.com/emberjs/rfcs/blob/master/text/0370-deprecate-computed-volatile.md)
* [Deprecation list](https://deprecations.emberjs.com/v3.x/#toc_computed-property-volatile)
* [Volatile spec](https://api.emberjs.com/ember/release/classes/ComputedProperty/methods/volatile?anchor=volatile)
* [Computed property spec](https://api.emberjs.com/ember/release/classes/ComputedProperty)
