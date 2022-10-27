# ember/no-settled-after-test-helper

✅ This rule is enabled in the `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Most of the test helper functions in
[`@ember/test-helpers`](https://github.com/emberjs/ember-test-helpers) call
`settled()` internally, which causes the test to wait until any effects of e.g.
the `click()` operation have settled. This means calling `await settled()` after
calling one of these test helpers is redundant and should not be necessary.

In some cases this pattern is mistakenly used to "wait a little more", which
usually indicated a deeper root cause issue, like a race condition or missing
test waiter somewhere. This pattern only works sometimes because it causes the
test to continue on the next tick of the JS runloop, instead of continuing
directly. It is highly recommended to fix the root cause in these cases instead
of relying on such brittle workarounds.

## Rule Details

This rule warns about cases where `await settled()` is used right after a call
to a test helper function that already calls `settled()` internally (or
`settled()` itself).

## Examples

Examples of **incorrect** code for this rule:

```js
test('...', async function (assert) {
  await click('.foo');
  await settled();
});
```

```js
test('...', async function (assert) {
  await fillIn('.foo');
  await settled();
});
```

```js
test('...', async function (assert) {
  await settled();
  await settled();
});
```

Examples of **correct** code for this rule:

```js
test('...', async function (assert) {
  await waitFor('.foo');
  await settled();
});
```

## Migration

- Have a look at the [ember-test-waiters](https://github.com/emberjs/ember-test-waiters) project

## References

- [`settled()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#settled)
