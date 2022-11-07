# ember/no-noop-setup-on-error-in-before

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallows use of no-op `setupOnerror` in `before`/`beforeEach` since it could mask errors or rejections in tests unintentionally

## Rule Details

This rule aims to avoid single no-op `setupOnerror` for all tests in the module. In certain situations(maybe the majority of the test cases throw an error), the author of the test might resort to the definition of single no-op `setupOnerror` in `before`/`beforeEach`. This might make sense at the time of writing the tests, but modules tend to grow and no-op error handler would swallow any promise rejection or error that otherwise would be caught by test.

## Examples

Examples of **incorrect** code for this rule:

```js
import { setupOnerror } from '@ember/test-helpers';
import { module } from 'qunit';

module('foo', function (hooks) {
  hooks.beforeEach(function () {
    setupOnerror(() => {});
  });
});
```

```js
import { setupOnerror } from '@ember/test-helpers';
import { module } from 'qunit';

module('foo', function (hooks) {
  hooks.before(function () {
    setupOnerror(() => {});
  });
});
```

Examples of **correct** code for this rule:

```js
import { setupOnerror } from '@ember/test-helpers';
import { module, test } from 'qunit';

module('foo', function (hooks) {
  test('something', function () {
    setupOnerror((error) => {
      assert.equal(error.message, 'test', 'Should have message');
    });
  });
});
```
