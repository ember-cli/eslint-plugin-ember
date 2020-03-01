# require-super-in-init

Call `_super` in init lifecycle hooks.

When overriding the `init` lifecycle hook inside Ember Components, Controllers, Routes or Mixins, it is necessary to include a call to `_super`.

## Examples

Examples of **incorrect** code for this rule:

```javascript
export default Ember.Component.extend({
  init() {
    this.set('items', []);
  }
});
```

Examples of **correct** code for this rule:

```javascript
export default Ember.Component.extend({
  init(...args) {
    this._super(...args);
    this.set('items', []);
  }
});
```
