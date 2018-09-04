# Affirms that nested QUnit syntax is being used (use-nested-qunit-syntax)

The latest version of QUnit supports nested module syntax i.e. test() is invoked from a callback passed to module()

## Rule Details

This rule aims to enforce the new QUnit nested syntax.

Examples of **incorrect** code for this rule:

```js
module('foo-bar');

test('my foo-bar-test', function () {...})
```

Examples of **correct** code for this rule:

```js
import { module, test } from 'qunit';

module('foo-bar', function () {
  test('my foo-bar test', function (assert) {...})
});
```

## When Not To Use It

If you are not using >=ember-qunit@3.0.0

## Further Reading

https://github.com/emberjs/ember-qunit
