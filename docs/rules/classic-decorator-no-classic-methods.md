# classic-decorator-no-classic-methods

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

```javascript
export default class MyService extends Service {
  constructor(...args) {
    super(...args);
    this.set('foo', 'bar');
  }
}
```

Examples of **correct** code for this rule:

```javascript
@classic
export default class MyService extends Service {
  constructor(...args) {
    super(...args);
    this.set('foo', 'bar');
  }
}
```

```javascript
import { set } from '@ember/object';

export default class MyService extends Service {
  constructor(...args) {
    super(...args);
    set(this, 'foo', 'bar');
  }
}
```

```javascript
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
