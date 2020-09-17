# require-super-in-init

:white_check_mark: The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

:wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

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
