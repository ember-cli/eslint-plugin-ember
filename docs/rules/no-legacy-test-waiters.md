# ember/no-legacy-test-waiters

✅ This rule is enabled in the `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Prevents the use of the legacy test waiter APIs.

## Rule Details

The legacy test waiters API has been superseded by the new [ember-test-waiters](https://github.com/emberjs/ember-test-waiters) addon.
This new addon provides an enhanced test waiter with robust debugging capabilities. Please use this in favor of the legacy waiter system, as detailed in [RFC 581](https://github.com/emberjs/rfcs/blob/master/text/0581-new-test-waiters.md).

## Examples

Examples of **incorrect** code for this rule:

```js
import Component from '@ember/component';
import { registerWaiter } from '@ember/test';

let counter = 0;

if (DEBUG) {
  registerWaiter(() => {
    return counter === 0;
  });
}

export default Component.extend({
  init(...args) {
    this._super(...args);
    counter++;
    someAsync()
      .then(() => console.log('hi'))
      .finally(() => counter--);
  }
});
```

```js
import Component from '@ember/component';
import { registerWaiter, unregisterWaiter } from '@ember/test';

let counter = 0;
const waiter = () => {
  return counter === 0;
};

if (DEBUG) {
  registerWaiter(waiter);
}

export default Component.extend({
  init(...args) {
    this._super(...args);
    counter++;
    someAsync()
      .then(() => console.log('hi'))
      .finally(() => counter--);
  },

  willDestroy() {
    unregisterWaiter(waiter);
  }
});
```

Examples of **correct** code for this rule:

```js
import Component from '@ember/component';
import { buildWaiter } from 'ember-test-waiters';

const waiter = buildWaiter('my-waiter');

export default Component.extend({
  init(...args) {
    this._super(...args);
    const token = waiter.beginAsync();
    someAsync()
      .then(() => console.log('hi'))
      .finally(() => waiter.endAsync(token));
  }
});
```

## References

For more information on the new test waiters API, please visit [ember-test-waiters](https://github.com/emberjs/ember-test-waiters).
