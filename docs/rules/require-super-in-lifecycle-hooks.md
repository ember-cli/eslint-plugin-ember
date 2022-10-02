# require-super-in-lifecycle-hooks

✅ The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

Call super in lifecycle hooks.

When overriding lifecycle hooks inside Ember Components, Controllers, Routes, Mixins, or Services, it is necessary to include a call to super.

## Examples

Examples of **incorrect** code for this rule:

```js
import Component from '@ember/component';

export default Component.extend({
  init() {
    this.set('items', []);
  }
});
```

```js
import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    // ...
  }
});
```

```js
import Component from '@ember/component';

class Foo extends Component {
  init() {
    // ...
  }
}
```

Examples of **correct** code for this rule:

```js
import Component from '@ember/component';

export default Component.extend({
  init(...args) {
    this._super(...args);
    this.set('items', []);
  }
});
```

```js
import Component from '@ember/component';

export default Component.extend({
  didInsertElement(...args) {
    this._super(...args);
    // ...
  }
});
```

```js
import Component from '@ember/component';

class Foo extends Component {
  init(...args) {
    super.init(...args);
    // ...
  }
}
```

```js
import Component from '@ember/component';

class Foo extends Component {
  didInsertElement(...args) {
    super.didInsertElement(...args);
    // ...
  }
}
```

## Configuration

This rule takes an optional object containing:

- `boolean` -- `checkInitOnly` -- whether the rule should only check the `init` lifecycle hook and not other lifecycle hooks (default `false`)
- `boolean` -- `checkNativeClasses` -- whether the rule should check lifecycle hooks in native classes (in addition to classic classes) (default `true`)
