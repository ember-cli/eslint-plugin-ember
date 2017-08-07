## Call _super in init lifecycle hooks

### Rule name: `call-super-in-init`

When overriding the `init` lifecycle hook inside Ember Components, Controllers, Routes or Mixins, it is necessary to include a call to `_super`.

```javascript
// BAD
export default Ember.Component.extend({
  init() {
    this.set('items', []);
  },
});
```

```javascript
// GOOD
export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.set('items', []);
  },
});
```
