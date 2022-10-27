# ember/use-brace-expansion

✅ This rule is enabled in the `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

This allows much less redundancy and is easier to read.

Note that **the dependent keys must be together (without space)** for the brace expansion to work.

## Examples

Examples of **incorrect** code for this rule:

```js
export default Component.extend({
  fullName: computed('user.firstName', 'user.lastName', {
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
