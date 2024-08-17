# ember/require-async-inverse-relationship

<!-- end auto-generated rule header -->

This rule ensures that the `async` and `inverse` properties are specified in `@belongsTo` and `@hasMany` decorators in Ember Data models.

## Rule Details

This rule disallows:

- Using `@belongsTo` without specifying the `async` and `inverse` properties.
- Using `@hasMany` without specifying the `async` and `inverse` properties.

## Examples

Examples of **incorrect** code for this rule:

```js
import Model, { belongsTo, hasMany } from '@ember-data/model';

export default class FolderModel extends Model {
  @hasMany('folder', { inverse: 'parent' }) children;
  @belongsTo('folder', { inverse: 'children' }) parent;
}
```

Examples of **correct** code for this rule:

```js
import Model, { belongsTo, hasMany } from '@ember-data/model';

export default class FolderModel extends Model {
  @hasMany('folder', { async: true, inverse: 'parent' }) children;
  @belongsTo('folder', { async: true, inverse: 'children' }) parent;
}
```

## References

- [Deprecate Non Strict Relationships](https://deprecations.emberjs.com/id/ember-data-deprecate-non-strict-relationships)
- [Ember Data Relationships](https://guides.emberjs.com/release/models/relationships)
