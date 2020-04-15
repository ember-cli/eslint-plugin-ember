# no-test-this-render

Ember's `this.render`/`this.clearRender` method and [`@ember/test-helpers`](https://github.com/emberjs/ember-test-helpers)'s `render`/`clearRender` method are equivalent, but using `@ember/test-helpers`' `render`/`clearRender` method is the recommended approach.

## Rule Details

The rule invites users to call `@ember/test-helpers`' `render`/`clearRender` method instead of `this.render`/`this.clearRender` in tests.

## Examples

Examples of **incorrect** code for this rule:

```js
test('baz', function (assert) {
  this.render();
});
```

```js
test('baz', function (assert) {
  this.clearRender();
});
```

Examples of **correct** code for this rule:

```js
import { render } from '@ember/test-helpers';

test('baz', function (assert) {
  render();
});
```

```js
import { clearRender } from '@ember/test-helpers';

test('baz', function (assert) {
  clearRender();
});
```

## References
* [Rendering Helpers on `@ember/test-helpers`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#rendering-helpers).
