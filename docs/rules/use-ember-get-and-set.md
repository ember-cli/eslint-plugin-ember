## Use `Ember.get` and `Ember.set`

### Rule name: `use-ember-get-and-set`

This way you don't have to worry whether the object that you're trying to access is an `Ember.Object` or not. It also solves the problem of trying to wrap every object in `Ember.Object` in order to be able to use things like `getWithDefault`.

This rule can be used with `eslint --fix` to automatically fix some occurrences.
To be auto-fixed, `Ember` must be imported.
Ideally, you should also be using [local modules](./local-modules.md); otherwise, the fixed code will look like `Ember.get(this, fooProperty')` instead of `get(this, 'fooProperty')`.

```javascript
// Bad
this.get('fooProperty');
this.set('fooProperty', 'bar');
this.getWithDefault('fooProperty', 'defaultProp');
object.get('fooProperty');
object.getProperties('foo', 'bar');
object.setProperties({ foo: 'bar', baz: 'qux' });

// Good

const {
  get,
  set,
  getWithDefault,
  getProperties,
  setProperties
} = Ember;
// ...
get(this, 'fooProperty');
set(this, 'fooProperty', 'bar');
getWithDefault(this, 'fooProperty', 'defaultProp');
get(object, 'fooProperty');
getProperties(object, 'foo', 'bar');
setProperties(object, { foo: 'bar', baz: 'qux' });
```
