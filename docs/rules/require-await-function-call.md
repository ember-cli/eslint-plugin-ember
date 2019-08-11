# require-await-function-call

Some functions are asynchronous and we want to wait for their code to finish executing before continuing on. The modern `async` / `await` syntax can help us achieve this.

## Rule Details

This lint rule requires that specified functions (defaulting to the [async Ember test helpers](../../lib/utils/async-ember-test-helpers.js) like `click` and `visit`) be called with the `async` keyword. The benefits of this include:

* Ensure code runs in the right (deterministic) order (potentially making tests more deterministic and reducing test flakiness)
* Promote cleaner code by reducing unwieldy promise chain usage
* Enforce a consistent way of calling/chaining asynchronous functions

## Examples

Examples of **incorrect** code for this rule:

```js
// Lint rule configuration: ['error', { functions: ['asyncFunc1', 'asyncFunc2'] }]
function doSomethingInvalid() {
  return asyncFunc1().then(() => {
    return asyncFunc2();
  });
}
```

```js
// Lint rule configuration: ['error', { functions: ['click'] }]
test('clicking the button sends the action', function(assert) {
  click('.my-button');
  assert.ok(this.myAction.calledOnce);
});
```

```js
// Lint rule configuration: ['error', { functions: ['click'] }]
test('clicking the button sends the action', function(assert) {
  click('.my-button').then(() => {
    assert.ok(this.myAction.calledOnce);
  });
});
```

Examples of **correct** code for this rule:

```js
// Lint rule configuration: ['error', { functions: ['asyncFunc1', 'asyncFunc2'] }]
async function doSomethingValid() {
  await asyncFunc1();
  await asyncFunc2();
}
```

```js
// Lint rule configuration: ['error', { functions: ['click'] }]
test('clicking the button sends the action', async function(assert) {
  await click('.my-button');
  assert.ok(this.myAction.calledOnce);
});
```

## Options

* OPTIONAL: `functions` is an array of the names of functions that must be called with `await`. Defaults to the [async Ember test helpers](../../lib/utils/async-ember-test-helpers.js) like `click` and `visit`.

## Migration

* [async-await-codemod](https://github.com/sgilroy/async-await-codemod) can help convert async function calls / promise chains to use `await`
* [ember-test-helpers-codemod](https://github.com/simonihmig/ember-test-helpers-codemod) has transforms such as [click](https://github.com/simonihmig/ember-test-helpers-codemod/blob/master/transforms/acceptance/transforms/click.js) that can be modified to call `makeAwait()` and `dropAndThen()` on the function calls that you're trying to bring into compliance with this rule

## When Not To Use It

You should avoid enabling this rule if:

* Your JavaScript/browser environment does not support `async` functions (an ES8/ES2017 feature)
* You have no asynchronous functions
* You prefer to use promise chains instead of the `async` keyword

## Related Rules

* [ember/no-test-and-then](no-test-and-then.md)
* [no-await-in-loop](https://eslint.org/docs/rules/no-await-in-loop)
* [no-return-await](https://eslint.org/docs/rules/no-return-await)
* [require-atomic-updates](https://eslint.org/docs/rules/require-atomic-updates)
* [require-await](https://eslint.org/docs/rules/require-await)

## Resources

* See the [documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) for async functions
* See the [guide](https://guides.emberjs.com/release/testing/acceptance/) with Ember acceptance test helpers