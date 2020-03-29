# no-ember-testing-in-module-scope

`Ember.testing` is not allowed in modules scope.

Since ember-cli-qunit@4.1.0 / ember-qunit@3.0.0, `Ember.testing` is only set to
true while a test is executing instead of all the time. Also, `Ember.testing` is a
getter/setter in Ember and destructuring will only read its value at the time
of destructuring.

<https://github.com/emberjs/ember-test-helpers/pull/227>

## Examples

Examples of **incorrect** code for this rule:

```js
import Component from '@ember/component';

export default Component.extend({
  init() {
    this.isTesting = Ember.testing;
  }
});
```

```js
import Ember from 'ember';
import Component from '@ember/component';

export default Component.extend({
  isTesting: Ember.testing
});
```

```js
import Ember from 'ember';

const IS_TESTING = Ember.testing;
```

```js
import Ember from 'ember';

const { testing } = Ember;
```

Examples of **correct** code for this rule:

```javascript
import Ember from 'ember';
import Component from '@ember/component';

export default Component.extend({
  someMethod() {
    if (Ember.testing) {
      doSomething();
    } else {
      doSomethingElse();
    }
  }
});
```

```js
import Ember from 'ember';
import Service from '@ember/service';

export default Service.extend({
  foo() {
    _bar(Ember.testing ? 0 : 400);
  }
});
```
