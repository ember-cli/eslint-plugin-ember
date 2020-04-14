# no-this-render

Ember's `this.render` method and [`@ember/test-helpers`](https://github.com/emberjs/ember-test-helpers)'s `render` method are equivalent, but using `test-helpers`' `render` method is the recommended approach.

## Rule Details

The rule invites users to call `@ember/test-helpers`' `render` method instead of `this.render` in tests.

## Examples

Examples of **incorrect** code for this rule:

```js
test('baz', function(assert) {
  this.render();
});
```

Examples of **correct** code for this rule:

```js
test('baz', function(assert) {
  render();
});
```

```js
test('baz', function(assert) {
  something.render();
});
```
