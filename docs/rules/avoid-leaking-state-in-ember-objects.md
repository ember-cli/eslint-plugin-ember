## Avoid leaking state

### Rule name: `avoid-leaking-state-in-ember-objects`

#### Configuration

Example configuration:

```
ember/avoid-leaking-state-in-ember-objects: [1, [
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

// BAD
export default Foo.extend({
  items: A(),

  actions: {
    addItem(item) {
      this.get('items').pushObject(item);
    },
  },
});

// BAD
export default Foo.extend({
  someObj: EmberObject.create({ bar: null }),

  actions: {
    chamgeProp(val) {
      this.set('someObj.bar', val);
    },
  },
});
```

```javascript
// Good
export default Foo.extend({
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
