## Avoid leaking state

### Rule name: `avoid-leaking-state-in-components`

#### Configuration

Example configuration:

```
ember/avoid-leaking-state-in-components: [1, [
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
export default Ember.Component.extend({
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
export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.items = [];
  },

  actions: {
    addItem(item) {
      this.get('items').pushObject(item);
    },
  },
});
```
