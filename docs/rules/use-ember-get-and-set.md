## Use `Ember.get` and `Ember.set`

### Rule name: `use-ember-get-and-set`

#### Configuration

```
ember/use-ember-get-and-set: [2, {
  ignoreThisExpressions: false,
}]
```

Setting `ignoreThisExpressions` to `true` allows use of `this.get()` and `this.set()` where you will generally know if `this` is an `Ember.Object`.

Setting `ignoreNonThisExpressions` to `true` allows use of non-Ember objects like `server.get()` and `map.set()`.

#### Description

This way you don't have to worry whether the object that you're trying to access is an `Ember.Object` or not. It also solves the problem of trying to wrap every object in `Ember.Object` in order to be able to use things like `getWithDefault`.

Ember tests use `this.get()` and `this.set()` as test helpers, so uses of them in the `tests` directory will not be reported.
In addition, all files in the `mirage` directory will be excluded from this rule.

This rule can be used with `eslint --fix` to automatically fix some occurrences.
To be auto-fixed, `Ember` must be imported.
Ideally, you should also be using [new-module-imports](./new-module-imports.md); otherwise, the fixed code will look like `Ember.get(this, fooProperty')` instead of `get(this, 'fooProperty')`.

```javascript
// Not recommended
this.get('fooProperty');
this.set('fooProperty', 'bar');
this.getWithDefault('fooProperty', 'defaultProp');
object.get('fooProperty');
object.getProperties('foo', 'bar');
object.setProperties({ foo: 'bar', baz: 'qux' });

// Recommended
import {
  get,
  set,
  getWithDefault,
  getProperties,
  setProperties
} from '@ember/object';

// ...

get(this, 'fooProperty');
set(this, 'fooProperty', 'bar');
getWithDefault(this, 'fooProperty', 'defaultProp');
get(object, 'fooProperty');
getProperties(object, 'foo', 'bar');
setProperties(object, { foo: 'bar', baz: 'qux' });
```
