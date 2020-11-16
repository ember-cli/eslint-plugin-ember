# avoid-leaking-state-in-ember-objects

:white_check_mark: The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

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

If you have properties where you know that the shared state won't be a problem (for example, read-only configuration values),
you can configure this rule to ignore specific properties. Ember already does this internally for properties such as `actions`.

The configuration of this rule takes a second argument that is a list of property names to ignore. This plugin makes the default
list of ignored properties available for you to extend from, as follows:

```js
const {
  DEFAULT_IGNORED_PROPERTIES
} = require('eslint-plugin-ember/lib/rules/avoid-leaking-state-in-ember-objects');

module.exports = {
  rules: {
    'ember/avoid-leaking-state-in-ember-objects': [
      'error',
      [...DEFAULT_IGNORED_PROPERTIES, 'array', 'of', 'ignored', 'properties']
    ]
  }
};
```
