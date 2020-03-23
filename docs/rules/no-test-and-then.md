# no-test-and-then

Use `await` instead of `andThen` test wait helper.

It's no longer necessary to use the `andThen` test wait helper now that the cleaner [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) syntax is available.

## Examples

Examples of **incorrect** code for this rule:

```js
test('behaves correctly', function (assert) {
  click('.button');
  andThen(() => {
    assert.ok(this.myAction.calledOnce);
  });
});
```

Examples of **correct** code for this rule:

```js
test('behaves correctly', async function (assert) {
  await click('.button');
  assert.ok(this.myAction.calledOnce);
});
```

## Migration

* [async-await-codemod](https://github.com/sgilroy/async-await-codemod) can help convert async function calls / promise chains to use `await`
* [ember-test-helpers-codemod](https://github.com/simonihmig/ember-test-helpers-codemod) has transforms such as [click](https://github.com/simonihmig/ember-test-helpers-codemod/blob/master/transforms/acceptance/transforms/click.js) that can be modified to call `makeAwait()` and `dropAndThen()` on the function calls that you're trying to bring into compliance with this rule
