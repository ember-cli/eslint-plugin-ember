# No this jQuery (no-this-jquery)
Do not use global `this.$` on components or tests.

## Rule Details

If you plan to refactor your application to stop using jQuery but you haven't removed it yet,
ensuring you don't use `this.$` will help you on the process.
Common places where `this.$` are used are components, where you can use the native DOM element in
`this.element` and in integration tests, where you can use [ember-native-dom-helpers](https://github.com/cibernox/ember-native-dom-helpers)
to find elements.

Examples of **incorrect** code for this rule:

```js
export default Component.extend({
  didInsertElement() {
    this.$('input').focus();
  }
});
```

Examples of **correct** code for this rule:

```js
export default Component.extend({
  didInsertElement() {
    this.element.querySelector('input').focus();
  }
});
```
