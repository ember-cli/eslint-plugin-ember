# Do not use async actions
## Rule `no-async-actions`

Using async actions can lead to memory leaks and application errors if you 
don't check for `isDestroying` and `isDestroyed` after each async step


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

