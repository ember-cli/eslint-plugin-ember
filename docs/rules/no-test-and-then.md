# Use `await` instead of `andThen` test wait helper. (no-test-and-then)

It's no longer necessary to use the `andThen` test wait helper now that the cleaner [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) syntax is available.

## Rule Details

Examples of **incorrect** code for this rule:

```js
test('behaves correctly', function(assert) {
  click('.button');
  andThen(() => {
    assert.ok(this.myAction.calledOnce);
  });
});
```

Examples of **correct** code for this rule:

```js
test('behaves correctly', async function(assert) {
  await click('.button');
  assert.ok(this.myAction.calledOnce);
});
```
