## Use the correct hooks in classic/non-classic classes

### Rule name: `classic-decorator-hooks`

Use the correct lifecycle hooks in classic and non-classic classes. Classic
classes should use `init`, and non-classic classes should use `constructor`.
Additionally, non-classic classes may not use `destroy`.

```javascript
// Bad
export default class MyService extends Service {
  init() {
    // ...
  }

  destroy() {
    // ...
  }
}

@classic
export default class MyService extends Service {
  constructor() {
    // ...
  }
}
```

```javascript
// Good
@classic
export default class MyService extends Service {
  init() {
    // ...
  }

  destroy() {
    // ...
  }
}

export default class MyService extends Service {
  constructor() {
    // ...
  }

  willDestroy() {

  }
}
```

### References

- [ember-classic-decorator](https://github.com/pzuraq/ember-classic-decorator)

### Related Rules

- [classic-decorator-no-classic-methods](classic-decorator-no-classic-methods.md)
