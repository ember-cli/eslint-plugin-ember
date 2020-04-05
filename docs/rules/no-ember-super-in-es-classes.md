# no-ember-super-in-es-classes

:white_check_mark: The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

:wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

`this._super` is not allowed in ES class methods.

While `this._super()` is the only way to invoke an overridden method in an `EmberObject.extend`-style class, the `_super` method doesn't work properly when using native class syntax. Fortunately, native classes come with their own mechanism for invoking methods from a parent.

## Examples

Examples of **incorrect** code for this rule:

```javascript
import Component from '@ember/component';

export default class MyComponent extends Component {
  init(...args) {
    this._super(...args);
    // Other logic
  }
}
```

Examples of **correct** code for this rule:

```javascript
import Component from '@ember/component';

export default class MyComponent extends Component {
  init(...args) {
    super.init(...args);
    // Other logic
  }
}
```

```javascript
import Component from '@ember/component';

export default Component.extend({
  init(...args) {
    this._super(...args);
    // Other logic
  }
});
