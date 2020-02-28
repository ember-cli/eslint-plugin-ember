# no-on-calls-in-components

Prevents using `.on()` in favour of component's lifecycle hooks.

The order of execution for `on()` is not deterministic.

## Examples

Examples of **incorrect** code for this rule:

```javascript
export default Component.extend({
  abc: on('didInsertElement', function () { /* custom logic */ }),
});
```

Examples of **correct** code for this rule:

```js
export default Component.extend({
  didInsertElement() { /* custom logic */ }
});
```
