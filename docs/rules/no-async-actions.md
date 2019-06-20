# Do not use async actions
## Rule `no-async-actions`

The problem is that it's possible for promise callback to run after the component has been destroyed, 
and Ember will complain if you try and call `set()` on a destroyed object.


Examples of **incorrect** code for this rule:
```js
actions: {
  async handleClick() {
    // ...
  }
}
```

```js
actions: {
  handleClick() {
    return something.then(() => { /* ... */ });
  }
}
```

```js
@action
async handleClick() {
  // ...
}
```

```js
@action
handleClick() {
  return something.then(() => { /* ... */ });
}
```


Examples of **correct** code for this rule:
```js
actions: {
  handleClick() {
    return nothingOrSomethingThatIsNotAPromise;
  }
}
```


## Further Reading

- Ember Concurrency http://ember-concurrency.com/docs/tutorial (scroll down to Version 4)

