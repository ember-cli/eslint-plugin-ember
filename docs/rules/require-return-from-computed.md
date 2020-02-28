# require-return-from-computed

Always return a value from a computed property function.

## Examples

Examples of **incorrect** code for this rule:

```javascript
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  firstName: null,
  lastName: null,

  fullName: computed('firstName', 'lastName', {
    get() {
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
      return `Dr. ${this.get('firstName')}`;
    }
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
      return `${this.get('firstName')} ${this.get('lastName')}`;
    },
    set(key, value) {
      let [firstName, lastName] = value.split(/\s+/);
      this.set('firstName', firstName);
      this.set('lastName', lastName);
      return value;
    }
  }),

  salutation: computed('firstName', function() {
    if (this.get('firstName')) {
      return `Dr. ${this.get('firstName')}`;
    }
    return '';
  })
});
```

## Migration

To avoid false positives from relying on implicit returns in some code branches, you may want to enforce [consistent-return] alongside this rule.

## Related Rules

* [consistent-return] from eslint

[consistent-return]: https://eslint.org/docs/rules/consistent-return

## Help Wanted

| Issue | Link |
| :-- | :-- |
| :x: Missing native JavaScript class support | [#560](https://github.com/ember-cli/eslint-plugin-ember/issues/560) |
