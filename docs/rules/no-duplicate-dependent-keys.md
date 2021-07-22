# no-duplicate-dependent-keys

✅ The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

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
