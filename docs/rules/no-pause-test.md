# no-pause-test

✅ The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

Disallow use of `pauseTest` helper in tests.

When `pauseTest()` is committed and run in CI it can cause runners to hang which is undesirable.

## Rule Details

This rule aims to prevent `pauseTest()` from being committed and run in CI.

## Examples

Examples of **incorrect** code for this rule:

```js
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

import { pauseTest } from '@ember/test-helpers';

module('Acceptance | foo test', function (hooks) {
  setupApplicationTest(hooks);

  test('it hangs', async function () {
    await this.pauseTest();
    // or
    await pauseTest();
  });
});
```

## When Not To Use It

If you have tests that call `resumeTest()` following a `pauseTest()`

```js
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

import { pauseTest, resumeTest } from '@ember/test-helpers';

module('Acceptance | foo test', function (hooks) {
  setupApplicationTest(hooks);

  test('it runs', function () {
    const promise = pauseTest();

    // Do some stuff

    resumeTest(); // Done
  });
});
```

## Further Reading

* [ember-test-helpers pauseTest documentation](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#pausetest)
