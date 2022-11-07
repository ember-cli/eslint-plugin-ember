# ember/no-jquery

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

This rule attempts to catch and prevent any usage of jQuery.

## Rule Details

If you want to remove jQuery, this rule can help you by warning you of any usage of jQuery in your app.

That includes:

- `this.$`, either on components or tests.
- `import $ from 'jquery';`;
- The global `$`
- `Ember.$` or `const { $ } = Ember;`

## Examples

Examples of **incorrect** code for this rule:

```js
export default Component.extend({
  didInsertElement() {
    this.$('input').focus();
  }
});
```

```js
export default Component.extend({
  click() {
    $('body').addClass('expanded');
    // or
    Ember.$('body').addClass('expanded');
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

```js
export default Component.extend({
  click() {
    document.body.classList.add('expanded');
  }
});
```

## Migration

For replacing `this.$` on components, you can use the native DOM counterpart `this.element`.

For replacing `this.$` on tests, check [ember-native-dom-helpers](https://github.com/cibernox/ember-native-dom-helpers).

Codemods that could help:

- [ember-3x-codemods](https://github.com/ember-codemods/ember-3x-codemods)
- [ember-test-helpers-codemod](https://github.com/ember-codemods/ember-test-helpers-codemod)

## RFCs

- [Make jQuery optional](https://github.com/emberjs/rfcs/blob/master/text/0294-optional-jquery.md)
- [Remove jQuery by default](https://github.com/emberjs/rfcs/blob/master/text/0386-remove-jquery.md)

## Related

- [jquery-ember-run](./jquery-ember-run.md)
- [no-global-jquery](./no-global-jquery.md)
