## Always return a value from a computed property function

### Rule name: `return-from-computed`

When using computed properties always return a value.

```javascript
import Ember from 'ember';

const {
  Component,
  computed
} = Ember;

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
  })
});
```
