# require-return-from-computed

✅ The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

Always return a value from a computed property function.

Note that this rule applies only to computed properties in classic classes (i.e. `Component.extend({})`) and not in native JavaScript classes with decorators. ESLint already has two recommended rules [getter-return] and [no-setter-return] that enforce the correct behavior with native classes.

## Examples

Examples of **incorrect** code for this rule:

```js
/* eslint "consistent-return": "off" */
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  firstName: null,
  lastName: null,

  fullName: computed('firstName', 'lastName', {
    get() {
      return `${this.firstName} ${this.lastName}`;
    },
    set(key, value) {
      const [firstName, lastName] = value.split(/\s+/);
      this.set('firstName', firstName);
      this.set('lastName', lastName);
      // Missing return here.
    }
  }),

  salutation: computed('firstName', function () {
    if (this.firstName) {
      return `Dr. ${this.firstName}`;
    }
    // Missing return here.
  })
});
```

Examples of **correct** code for this rule:

```js
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  firstName: null,
  lastName: null,

  fullName: computed('firstName', 'lastName', {
    get() {
      return `${this.firstName} ${this.lastName}`;
    },
    set(key, value) {
      const [firstName, lastName] = value.split(/\s+/);
      this.set('firstName', firstName);
      this.set('lastName', lastName);
      return value;
    }
  }),

  salutation: computed('firstName', function () {
    if (this.firstName) {
      return `Dr. ${this.firstName}`;
    }
    return '';
  })
});
```

## Migration

To avoid false positives from relying on implicit returns in some code branches, you may want to enforce [consistent-return] alongside this rule.

## Related Rules

* [consistent-return] from eslint
* [getter-return] from eslint
* [no-setter-return] from eslint

[consistent-return]: https://eslint.org/docs/rules/consistent-return
[getter-return]: https://eslint.org/docs/rules/getter-return
[no-setter-return]: https://eslint.org/docs/rules/no-setter-return
