# use-brace-expansion

This allows much less redundancy and is easier to read.

Note that **the dependent keys must be together (without space)** for the brace expansion to work.

## Examples

Examples of **incorrect** code for this rule:

```js
fullName: computed('user.firstName', 'user.lastName', {
  // Code
})
```

Examples of **correct** code for this rule:

```javascript
fullName: computed('user.{firstName,lastName}', {
  // Code
})
```
