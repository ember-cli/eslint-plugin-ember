# classic-decorator-hooks

Use the correct lifecycle hooks in classic and non-classic classes. Classic
classes should use `init`, and non-classic classes should use `constructor`.
Additionally, non-classic classes may not use `destroy`.

## Examples

Examples of **incorrect** code for this rule:

```javascript
export default class MyService extends Service {
  init() {
    // ...
  }

  destroy() {
    // ...
  }
}
```

```javascript
@classic
export default class MyService extends Service {
  constructor() {
    super();
    // ...
  }
}
```

Examples of **correct** code for this rule:

```javascript
@classic
export default class MyService extends Service {
  init() {
    // ...
  }

  destroy() {
    // ...
  }
}
```

```javascript
export default class MyService extends Service {
  constructor() {
    super();
    // ...
  }

  willDestroy() {
    // ...
  }
}
```

## References

- [ember-classic-decorator](https://github.com/pzuraq/ember-classic-decorator)

## Related Rules

- [classic-decorator-no-classic-methods](classic-decorator-no-classic-methods.md)
