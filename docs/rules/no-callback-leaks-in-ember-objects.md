
# Avoid callback leaks in Ember objects
## Rule `no-callback-leaks-in-ember-objects`

Callback leaks are memory leaks that occur due to state being caught in a callback function that is never released from memory.

Since callback functions for things like event listeners and interval timers are retained by reference elsewhere, you must be careful to unregister them when no longer needed or ensure that the context they're registered with is destroyed.


Examples of **incorrect** code for this rule:

```js
export default Ember.Component.extend({
  didInsertElement() {
    if (this.get('onScroll')) {
      window.addEventListener('scroll', (...args) => this.get('onScroll')(...args));
    }
  }
});
```

Examples of **correct** code for this rule:

```js
export default Ember.Component.extend({
  didInsertElement() {
    if (this.get('onScroll')) {
      this._onScrollHandler = (...args) => this.get('onScroll')(...args);
      window.addEventListener('scroll', this._onScrollHandler);
    }
  },

  willDestroy() {
    window.removeEventListener('scroll', this._onScrollHandler);
  }
});
```

## Further Reading

https://github.com/ember-best-practices/memory-leak-examples/blob/master/exercises/exercise-2.md
