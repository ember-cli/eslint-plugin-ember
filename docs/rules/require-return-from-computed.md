# require-return-from-computed

:white_check_mark: The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

Always return a value from a computed property function.

## Examples

Examples of **incorrect** code for this rule:

```javascript
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

```javascript
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

[consistent-return]: https://eslint.org/docs/rules/consistent-return
[getter-return]: https://eslint.org/docs/rules/getter-return
