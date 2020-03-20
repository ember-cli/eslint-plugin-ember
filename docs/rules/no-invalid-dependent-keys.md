# no-invalid-dependent-keys

Dependent keys used for computed properties have to be valid

## Rule Details

This rule aims to avoid invalid dependent keys in computed properties.

Currently implemented:

- Unbalanced open and closed braces. These can be hard to track for complex computed properties
and are usually unchecked since the expressions are passed as Strings.

Not yet implemented:

- Check for invalid characters
- Check for invalid position of @each or []

## Examples

Examples of **incorrect** code for this rule:

```js
export default Component.extend({
  fullName: computed('user.{firstName,lastName', {
    // Code
  })
});
```

Examples of **correct** code for this rule:

```js

export default Component.extend({
  fullName: computed('user.{firstName,lastName}', {
    // Code
  })
});
```
