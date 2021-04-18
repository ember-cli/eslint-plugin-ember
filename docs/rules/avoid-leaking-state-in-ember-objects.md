# avoid-leaking-state-in-ember-objects

:white_check_mark: The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

Don't use arrays and objects as default properties in classic classes or mixins. In native classes, it is safe to assign objects to fields.

## Examples

Examples of **incorrect** code for this rule:

```js
export default Foo.extend({
  items: [],

  actions: {
    addItem(item) {
      this.items.pushObject(item);
    }
  }
});
```

```js
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  items: []
});
```

Examples of **correct** code for this rule:

```js
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

```js
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class FooComponent extends Component {
  items = [];

  @action
  addItem(item) {
    this.items = [...this.items, item];
  }
}
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

## References

- [Dockyard blog](https://dockyard.com/blog/2015/09/18/ember-best-practices-avoid-leaking-state-into-factories)
- [Ember native classes guides](https://guides.emberjs.com/release/upgrading/current-edition/native-classes/)
- [ember-native-class-codemod](https://github.com/ember-codemods/ember-native-class-codemod)
