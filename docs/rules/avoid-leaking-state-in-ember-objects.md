# avoid-leaking-state-in-ember-objects

:white_check_mark: The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

In addition, all files in the `mirage` directory will be excluded from this rule.

Don't use arrays and objects as default properties. More info here: <https://dockyard.com/blog/2015/09/18/ember-best-practices-avoid-leaking-state-into-factories>

## Examples

Examples of **incorrect** code for this rule:

```javascript
export default Foo.extend({
  items: [],

  actions: {
    addItem(item) {
      this.items.pushObject(item);
    }
  }
});
```

Examples of **correct** code for this rule:

```javascript
export default Foo.extend({
  init(...args) {
    this._super(...args);

    this.items = this.items || [];
  },

  actions: {
    addItem(item) {
      this.items.pushObject(item);
    }
  }
});
```

## Configuration

Example configuration:

```js
const {
  DEFAULT_IGNORED_PROPERTIES
} = require('eslint-plugin-ember/lib/rules/avoid-leaking-state-in-ember-objects');

module.exports = {
  rules: {
    'ember/avoid-leaking-state-in-ember-objects': [
      1,
      [...DEFAULT_IGNORED_PROPERTIES, 'array', 'of', 'ignored', 'properties']
    ]
  }
};
```
