### Avoid leaking state

#### `avoid-leaking-state-in-components`

*Example config:*
```netguru-ember/avoid-leaking-state-in-components: [1, ['array', 'of', 'ignored', 'properties']]```

Don't use arrays and objects as default properties. More info here: https://dockyard.com/blog/2015/09/18/ember-best-practices-avoid-leaking-state-into-factories


```
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

```
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
