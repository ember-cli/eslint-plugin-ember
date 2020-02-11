# no-ember-super-in-es-classes

`this._super` is not allowed in ES class methods.

While `this._super()` is the only way to invoke an overridden method in an `EmberObject.extend`-style class, the `_super` method doesn't work properly when using native class syntax. Fortunately, native classes come with their own mechanism for invoking methods from a parent.

## Examples

Examples of **incorrect** code for this rule:

```javascript
import Component from '@ember/component';
export default class MyComponent extends Component {
  init() {
    this._super(...arguments);
    // Other logic
  }
}
```

Examples of **correct** code for this rule:

```javascript
import Component from '@ember/component';
export default class MyComponent extends Component {
  init() {
    super.init(...arguments);
    // Other logic
  }
}
```

```javascript
import Component from '@ember/component';
export default Component.extend({
  init() {
    this._super(...arguments);
    // Other logic
  }
});
