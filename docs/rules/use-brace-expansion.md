# use-brace-expansion

:white_check_mark: The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

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

```javascript
export default Component.extend({
  fullName: computed('user.{firstName,lastName}', {
    // Code
  })
});
```

## Help Wanted

| Issue | Link |
| :-- | :-- |
| :x: Missing native JavaScript class support | [#560](https://github.com/ember-cli/eslint-plugin-ember/issues/560) |
