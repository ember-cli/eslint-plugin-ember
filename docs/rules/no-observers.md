## Don't use observers

### Rule name: `no-observers`

You should avoid observers for the following reasons:
  * Observers deal with data changes contrary to Ember's Data Down, Actions Up (DDAU) convention.
  * They also are synchronous by default which [has problems](https://emberjs.github.io/rfcs/0494-async-observers.html#motivation).
  * You can usually solve state management problems using other robust tools in Ember's toolbox such as actions, computed properties, or component life cycle hooks.

See [@ef4's](https://github.com/ef4/) [canonical answer](https://discuss.emberjs.com/t/why-should-i-not-use-observers-in-my-ember-application/16868/3) for why you should not use them.
Observers do have some limited uses. They let you reflect state from your application to foreign interfaces that don't follow Ember's data flow conventions.

```hbs
{{input value=text key-up="change"}}
```

```javascript
// GOOD
export default Controller.extend({
  actions: {
    change() {
      console.log(`change detected: ${this.text}`);
    },
  },
});

// BAD
export default Controller.extend({
  change: Ember.observer('text', function() {
    console.log(`change detected: ${this.text}`);
  },
});
```
