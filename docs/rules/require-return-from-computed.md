## Always return a value from a computed property function

### Rule name: `require-return-from-computed`

When using computed properties always return a value.

```javascript
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  firstName: null,
  lastName: null,

  // GOOD
  fullName: computed('firstName', 'lastName', {
    get(key) {
      return `${this.get('firstName')} ${this.get('lastName')}`;
    },
    set(key, value) {
      let [firstName, lastName] = value.split(/\s+/);
      this.set('firstName', firstName);
      this.set('lastName',  lastName);
      return value;
    }
  }),
  
  salutation: computed('firstName', function() {
    if (this.get('firstName')) {
      return `Dr. ${this.get('firstName')}`
    }
    return '';
  }),

  // BAD
  fullName: computed('firstName', 'lastName', {
    get(key) {
      return `${this.get('firstName')} ${this.get('lastName')}`;
    },
    set(key, value) {
      let [firstName, lastName] = value.split(/\s+/);
      this.set('firstName', firstName);
      this.set('lastName',  lastName);
    }
  }),
  
  salutation: computed('firstName', function() {
    if (this.get('firstName')) {
      return `Dr. ${this.get('firstName')}`
    }
  }),

});
```

### Migration

To avoid false positives from relying on implicit returns in some code branches, you may want to enforce [consistent-return] alongside this rule.

### Related Rules

* [consistent-return] from eslint

[consistent-return]: https://eslint.org/docs/rules/consistent-return