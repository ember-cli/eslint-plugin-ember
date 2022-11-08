# ember/no-on-calls-in-components

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Prevents using `.on()` in favour of component's lifecycle hooks.

The order of execution for `on()` is not deterministic.

## Examples

Examples of **incorrect** code for this rule:

```js
export default Component.extend({
  abc: on('didInsertElement', function () {
    /* custom logic */
  })
});
```

Examples of **correct** code for this rule:

```js
export default Component.extend({
  didInsertElement() {
    /* custom logic */
  }
});
```
