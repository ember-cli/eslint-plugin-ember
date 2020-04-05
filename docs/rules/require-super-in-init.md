# require-super-in-init

:white_check_mark: The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

Call `_super` in init lifecycle hooks.

When overriding the `init` lifecycle hook inside Ember Components, Controllers, Routes or Mixins, it is necessary to include a call to `_super`.

## Examples

Examples of **incorrect** code for this rule:

```javascript
import Component from '@ember/component';

export default Component.extend({
  init() {
    this.set('items', []);
  }
});
```

Examples of **correct** code for this rule:

```javascript
import Component from '@ember/component';

export default Component.extend({
  init(...args) {
    this._super(...args);
    this.set('items', []);
  }
});
```
