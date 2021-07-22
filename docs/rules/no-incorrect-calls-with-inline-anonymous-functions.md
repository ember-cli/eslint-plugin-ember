# no-incorrect-calls-with-inline-anonymous-functions

✅ The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

The following functions keep track of the function references they have been passed:

- `debounce`
- `once`
- `scheduleOnce`

To use them, make sure you are passing the same function reference each time. When an inline function is passed as an argument, the function reference will be different each time.

## Rule Details

This rule disallows using inline anonymous functions with the `debounce`, `once`, and `scheduleOnce` methods when imported from `@ember/runloop`.

## Examples

Examples of **incorrect** code for this rule:

```js
import { scheduleOnce, once, debounce } from '@ember/runloop';

export default Component.extend({
  didInsertElement() {
    this.doWork();
    this.doWork();
  },
  doWork() {
    debounce(() => {
      /* this will run twice */
    }, 300);
    once(() => {
      /* this will run twice */
    });
    scheduleOnce('afterRender', function () {
      /* this will run twice */
    });
  }
});
```

Examples of **correct** code for this rule:

```js
import { scheduleOnce } from '@ember/runloop';

export default Component.extend({
  didInsertElement() {
    this.doWork();
    this.doWork();
  },
  doWork() {
    scheduleOnce('afterRender', this, this.deferredWork);
  },
  deferredWork() {
    /* this will only run once */
  }
});
```

## References

- [Ember debounce API Docs](https://api.emberjs.com/ember/release/functions/@ember%2Frunloop/debounce)
- [Ember once API Docs](http://api.emberjs.com/ember/release/functions/@ember%2Frunloop/once)
- [Ember scheduleOnce API Docs](https://api.emberjs.com/ember/release/functions/@ember%2Frunloop/scheduleOnce)
