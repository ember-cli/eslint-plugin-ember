# Do not use async actions
## Rule `no-async-actions`



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

See http://ember-concurrency.com/docs/tutorial (scroll down to Version 4)
