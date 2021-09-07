# classic-decorator-hooks

✅ The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

Use the correct lifecycle hooks in classic and non-classic classes. Classic
classes should use `init`, and non-classic classes should use `constructor`.
Additionally, non-classic classes may not use `destroy`.

## Examples

Examples of **incorrect** code for this rule:

```js
export default class MyService extends Service {
  init() {
    // ...
  }

  destroy() {
    // ...
  }
}
```

```js
@classic
export default class MyService extends Service {
  constructor() {
    super(...arguments);
    // ...
  }
}
```

Examples of **correct** code for this rule:

```js
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

```js
export default class MyService extends Service {
  constructor() {
    super(...arguments);
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
