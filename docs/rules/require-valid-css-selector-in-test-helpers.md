# require-valid-css-selector-in-test-helpers

:wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

Test helpers and querySelector methods should be called with valid CSS selectors. Most of the time invalid selectors will result in a failing test but that is not always the case.

One example of invalid CSS selectors which do not cause failing tests is when using unclosed attribute selector blocks. Tests happen to pass today in this case due to a quirk in the CSS selector spec which is marked as [WontFix by Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=460399#c6).

## Rule Details

This rule requires the use of valid CSS selectors in test helpers and querySelector methods.

## Examples

Examples of **incorrect** code for this rule:

```js
import { test } from 'qunit';

test('foo', function (assert) {
  assert.dom('[data-test-foobar'); // qunit-dom
});
```

```js
import { test } from 'qunit';

test('foo', function () {
  document.querySelector('#1234');
});
```

```js
import { test } from 'qunit';

test('foo', function () {
  this.element.querySelectorAll('..foobar');
});
```

```js
import { find, click, fillIn, findAll, focus } from '@ember/test-helpers';
import { test } from 'qunit';

test('foo', function () {
  find('[data-test-foobar');
  findAll('[data-test-foobar');
  fillIn('[data-test-foobar');
  click('[data-test-foobar');
  focus('[data-test-foobar');
});
```

Examples of **correct** code for this rule:

```js
import { test } from 'qunit';

test('foo', function (assert) {
  assert.dom('[data-test-foobar]'); // qunit-dom
});
```

```js
import { test } from 'qunit';

test('foo', function () {
  document.querySelector('#abcd');
});
```

```js
import { test } from 'qunit';

test('foo', function () {
  this.element.querySelectorAll('.foobar');
});
```

```js
import { find, click, fillIn, findAll, focus } from '@ember/test-helpers';
import { test } from 'qunit';

test('foo', function () {
  find('[data-test-foobar]');
  findAll('[data-test-foobar]');
  fillIn('[data-test-foobar]');
  click('[data-test-foobar]');
  focus('[data-test-foobar]');
});
```
