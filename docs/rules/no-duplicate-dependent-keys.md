# no-duplicate-dependent-keys

Disallow repeating dependent keys.

## Rule Details

This rule makes it easy to spot repeating dependent keys in computed properties.

## Examples

Examples of **incorrect** code for this rule:

```js
computed('foo.bar', 'foo.baz', 'foo.qux', 'foo.bar', function() {
  // ...
});
// or using brace expansions
computed('foo.{bar,baz,qux}', 'foo.bar', function() {
  // ...
});
```

Examples of **correct** code for this rule:

```js
computed('foo.bar', 'foo.baz', 'foo.qux', function() {
  // ...
});
// or using brace expansions
computed('foo.{bar,baz,qux}', 'bar.foo', function() {
  // ...
});
```

## Help Wanted

| Issue | Link |
| :-- | :-- |
| :x: Missing native JavaScript class support | [#560](https://github.com/ember-cli/eslint-plugin-ember/issues/560) |
