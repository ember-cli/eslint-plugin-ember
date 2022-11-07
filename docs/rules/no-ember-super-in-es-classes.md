# ember/no-ember-super-in-es-classes

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

`this._super` is not allowed in ES class methods.

While `this._super()` is the only way to invoke an overridden method in an `EmberObject.extend`-style class, the `_super` method doesn't work properly when using native class syntax. Fortunately, native classes come with their own mechanism for invoking methods from a parent.

## Examples

Examples of **incorrect** code for this rule:

```js
import Component from '@ember/component';

export default class MyComponent extends Component {
  init(...args) {
    this._super(...args);
    // Other logic
  }
}
```

Examples of **correct** code for this rule:

```js
import Component from '@ember/component';

export default class MyComponent extends Component {
  init(...args) {
    super.init(...args);
    // Other logic
  }
}
```

```js
import Component from '@ember/component';

export default Component.extend({
  init(...args) {
    this._super(...args);
    // Other logic
  }
});
```
