# ember/no-test-this-set-get

<!-- end auto-generated rule header -->

In `.gjs`/`.gts` tests, the `<template>` tag has access to the surrounding scope, so any value used by a test's template can be a local variable (optionally tracked) instead of being assigned to the test context (`this`). As a result, the legacy `this.set`, `this.get`, `this.setProperties`, and `this.getProperties` helpers are no longer recommended in template-tag tests.

## Rule Details

This rule disallows the following in `.gjs` and `.gts` test files:

- `this.set(...)`, `this.get(...)`, `this.setProperties(...)`, `this.getProperties(...)` (including the computed `this["set"](...)` form).
- Calls to `set`, `get`, `setProperties`, and `getProperties` when imported from `@ember/object` (including aliased imports).

It does not flag these calls in `.js`/`.ts` tests, or in non-test files.

## Examples

Examples of **incorrect** code for this rule (in a `*-test.gjs` or `*-test.gts` file):

```gjs
test('it renders', async function (assert) {
  this.set('name', 'Zoey');
  await render(<template>{{this.name}}</template>);
});
```

```gjs
test('it reads', function (assert) {
  const value = this.get('name');
});
```

```gjs
test('it sets many', function (assert) {
  this.setProperties({ name: 'Zoey', age: 4 });
});
```

```gjs
test('it reads many', function (assert) {
  const { name, age } = this.getProperties('name', 'age');
});
```

```gjs
import { set } from '@ember/object';

test('it sets', function (assert) {
  set(obj, 'name', 'Zoey');
});
```

Examples of **correct** code for this rule (in a `*-test.gjs` or `*-test.gts` file):

```gjs
test('it renders', async function (assert) {
  const name = 'Zoey';
  await render(<template>{{name}}</template>);
});
```

```gjs
import { tracked } from '@glimmer/tracking';

class State {
  @tracked name = 'Zoey';
}

test('it renders', async function (assert) {
  const state = new State();
  await render(<template>{{state.name}}</template>);
  state.name = 'Tomster';
});
```

## References

- [RFC 779: First-Class Component Templates](https://github.com/emberjs/rfcs/pull/779)
- The legacy [`set`](https://api.emberjs.com/ember/release/functions/@ember%2Fobject/set), [`get`](https://api.emberjs.com/ember/release/functions/@ember%2Fobject/get), `setProperties`, and `getProperties` helpers from `@ember/object`.
