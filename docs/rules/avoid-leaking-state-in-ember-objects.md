## Avoid leaking state

### Rule name: `avoid-leaking-state-in-ember-objects`

#### Configuration

Example configuration:

```
const { DEFAULT_IGNORED_PROPERTIES } = require('eslint-plugin-ember/lib/rules/avoid-leaking-state-in-ember-objects');

ember/avoid-leaking-state-in-ember-objects: [1, [
  ...DEFAULT_IGNORED_PROPERTIES,
  'array',
  'of',
  'ignored',
  'properties',
]]
```

#### Description

Don't use arrays and objects as default properties. More info here: https://dockyard.com/blog/2015/09/18/ember-best-practices-avoid-leaking-state-into-factories

```javascript
// BAD
export default Foo.extend({
  items: [],

  actions: {
    addItem(item) {
      this.get('items').pushObject(item);
    },
  },
});
```

```javascript
// Good
export default Foo.extend({
  init() {
    this._super(...arguments);
    
    this.items = this.items || [];
  },

  actions: {
    addItem(item) {
      this.get('items').pushObject(item);
    },
  },
});
```
