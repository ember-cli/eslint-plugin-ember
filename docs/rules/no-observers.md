## Don't use observers

### Rule name: `no-observers`

Observers deal with data changes contrary to Ember's Data Down, Actions Up (DDAU) convention. They also are synchronous by default which [has problems](https://emberjs.github.io/rfcs/0494-async-observers.html#motivation). You can usually state management problems using other robust tools in Ember's toolbox such as actions, computed properties, or component life cycle hooks. Observers do have some limited uses. They let you reflect state from your application to foreign interfaces that don't follow Ember's data flow conventions. For the canonical, in-depth reasoning to why not see [@ef4's](https://github.com/ef4/) canonical answer [here](https://discuss.emberjs.com/t/why-should-i-not-use-observers-in-my-ember-application/16868/3)

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
