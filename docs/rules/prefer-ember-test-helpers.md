# prefer-ember-test-helpers

This rule ensures the correct Ember test helper is imported when using methods that have a native window counterpart.

There are currently 3 Ember test helper methods that have a native window counterpart:

* blur
* find
* focus

If these methods are not properly imported from Ember's test-helpers suite, and the native window method version is used instead, any intended asynchronous functions won't work as intended, which can cause tests to fail silently.

## Examples

Examples of **incorrect** code for this rule:

```js
test('foo', async (assert) => {
  await blur('.some-element');
});
```

```js
test('foo', async (assert) => {
  await find('.some-element');
});
```

```js
test('foo', async (assert) => {
  await focus('.some-element');
});
```

Examples of **correct** code for this rule:

```js
import { blur } from '@ember/test-helpers';

test('foo', async (assert) => {
  await blur('.some-element');
});
```

```js
import { find } from '@ember/test-helpers';

test('foo', async (assert) => {
  await find('.some-element');
});
```

```js
import { focus } from '@ember/test-helpers';

test('foo', async (assert) => {
  await focus('.some-element');
});
```

## References

* [Web API Window Methods](https://developer.mozilla.org/en-US/docs/Web/API/Window#Methods)
* [Ember Test Helpers API Methods](https://github.com/emberjs/ember-test-helpers/blob/master/API.md)
