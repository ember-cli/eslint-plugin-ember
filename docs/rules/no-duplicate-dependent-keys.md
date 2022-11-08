# ember/no-duplicate-dependent-keys

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallow repeating dependent keys.

## Rule Details

This rule makes it easy to spot repeating dependent keys in computed properties.

## Examples

Examples of **incorrect** code for this rule:

```js
computed('foo.bar', 'foo.baz', 'foo.qux', 'foo.bar', function () {
  // ...
});
// or using brace expansions
computed('foo.{bar,baz,qux}', 'foo.bar', function () {
  // ...
});
```

Examples of **correct** code for this rule:

```js
computed('foo.bar', 'foo.baz', 'foo.qux', function () {
  // ...
});
// or using brace expansions
computed('foo.{bar,baz,qux}', 'bar.foo', function () {
  // ...
});
```
