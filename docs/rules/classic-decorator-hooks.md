# ember/classic-decorator-hooks

✅ This rule is enabled in the `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

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
  constructor(...args) {
    super(...args);
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
  constructor(...args) {
    super(...args);
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
