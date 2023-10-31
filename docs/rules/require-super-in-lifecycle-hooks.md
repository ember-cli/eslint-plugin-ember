# ember/require-super-in-lifecycle-hooks

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Call super in lifecycle hooks.

When overriding lifecycle hooks inside Ember Components, Controllers, Routes, Mixins, or Services, it is necessary to include a call to super.

## Examples

Examples of **incorrect** code for this rule:

```js
import Component from '@ember/component';

export default Component.extend({
  init() {
    this.set('items', []);
  },
});
```

```js
import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    // ...
  },
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
  },
});
```

```js
import Component from '@ember/component';

export default Component.extend({
  didInsertElement(...args) {
    this._super(...args);
    // ...
  },
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
- `boolean` -- `requireArgs` -- whether the rule should check if super() in init hook is called with args (default `false`)
