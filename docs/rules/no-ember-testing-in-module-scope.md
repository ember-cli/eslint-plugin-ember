## `Ember.testing` is not allowed in modules scope

### Rule name: `no-ember-testing-in-module-scope`

Since ember-cli-qunit@4.1.0 / ember-qunit@3.0.0, `Ember.testing` is only set to
true while a test is executing instead of all the time. Also, `Ember.testing` is a
getter/setter in Ember and destructuring will only read its value at the time
of destructuring.
https://github.com/emberjs/ember-test-helpers/pull/227

```javascript
// Good
export default Component.extend({
  init() {
    this.isTesting = Ember.testing
  }
})

// Bad
import Ember from 'ember';

export default Ember.Component.extend({
  isTesting: Ember.testing
})

// Bad
import Ember from 'ember';

const IS_TESTING = Ember.testing;

// Bad
import Ember from 'ember';

const { testing } = Ember;
```
