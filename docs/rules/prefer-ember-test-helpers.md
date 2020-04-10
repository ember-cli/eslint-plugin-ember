# prefer-ember-test-helpers

This rule ensures the correct Ember test helper is imported when using methods that have a native window counterpart.

There are currently 3 Ember test helper methods that have a native window counterpart:

* blur
* find
* focus

If these methods are not properly imported from Ember's test-helpers suite, the native window method version is used instead, and any intended asynchronous functions won't work as intended, which causes tests to fail silently.

See the origin and background of the rule proposal: [eslint-plugin-ember issue 676](https://github.com/ember-cli/eslint-plugin-ember/issues/676)

## Examples

Examples of **incorrect** code for this rule:

```js
test('foo', async function(assert) {
  await blur();
});
```

```js
test('foo', async function(assert) {
  await find();
});
```

```js
test('foo', async function(assert) {
  await focus();
});
```

Examples of **correct** code for this rule:

```js
import { blur } from '@ember/test-helpers';

test('foo', async function(assert) {
  await blur();
});
```

```js
import { find } from '@ember/test-helpers';

test('foo', async function(assert) {
  await find();
});
```

```js
import { focus } from '@ember/test-helpers';

test('foo', async function(assert) {
  await focus();
});
```

## References

* (Web API Window Methods)[https://developer.mozilla.org/en-US/docs/Web/API/Window#Methods]
* (Ember Test Helpers API Methods)[https://github.com/emberjs/ember-test-helpers/blob/master/API.md]
