## `this._super` is not allowed in ES class methods

### Rule name: `no-ember-super-in-es-classes`

While `this._super()` is the only way to invoke an overridden method in an `EmberObject.extend`-style class, the `_super` method doesn't work properly when using native class syntax. Fortunately, native classes come with their own mechanism for invoking methods from a parent.

```javascript
// Good
import Component from '@ember/component';
export default class MyComponent extends Component {
  init() {
    super.init(...arguments);
    // Other logic
  }
}

// Good
import Component from '@ember/component';
export default Component.extend({
  init() {
    this._super(...arguments);
    // Other logic
  }
});

// Bad
import Component from '@ember/component';
export default class MyComponent extends Component {
  init() {
    this._super(...arguments);
    // Other logic
  }
}
```
