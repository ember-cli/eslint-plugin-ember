# ember/classic-decorator-no-classic-methods

✅ This rule is enabled in the `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Disallows the use of the following classic API methods within a class:

- `get`
- `set`
- `getProperties`
- `setProperties`
- `getWithDefault`
- `incrementProperty`
- `decrementProperty`
- `toggleProperty`
- `addObserver`
- `removeObserver`
- `notifyPropertyChange`
- `cacheFor`
- `proto`

These are "classic" API methods, and their usage is discouraged in Octane.
Non-method versions of them can still be used, e.g. `@ember/object#get` and
`@ember/object#set` instead of `this.get` and `this.set`.

## Examples

Examples of **incorrect** code for this rule:

```js
export default class MyService extends Service {
  constructor(...args) {
    super(...args);
    this.set('foo', 'bar');
  }
}
```

Examples of **correct** code for this rule:

```js
@classic
export default class MyService extends Service {
  constructor(...args) {
    super(...args);
    this.set('foo', 'bar');
  }
}
```

```js
import { set } from '@ember/object';

export default class MyService extends Service {
  constructor(...args) {
    super(...args);
    set(this, 'foo', 'bar');
  }
}
```

```js
import { tracked } from '@glimmer/tracking';

export default class MyService extends Service {
  @tracked foo = 'bar';
}
```

## References

- [ember-classic-decorator](https://github.com/pzuraq/ember-classic-decorator)

## Related Rules

- [no-get](no-get.md)
- [classic-decorator-hooks](classic-decorator-hooks.md)
- [Tracked properties](https://guides.emberjs.com/release/upgrading/current-edition/tracked-properties/)
