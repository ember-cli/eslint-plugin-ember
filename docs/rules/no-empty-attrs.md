# no-empty-attrs

Be explicit with Ember data attribute types.

Ember Data handles not specifying a transform in model description. Nonetheless this could lead to ambiguity. This rule ensures that the right transform is specified for every attribute.

Note: this rule is not in the `recommended` configuration because the Ember Data team recommends not using transforms unless you actually want to transform something.

## Examples

Examples of **incorrect** code for this rule:

```js
const { Model, attr } = DS;

export default Model.extend({
  name: attr(),
  points: attr(),
  dob: attr()
});
```

Examples of **correct** code for this rule:

```js
const { Model, attr } = DS;

export default Model.extend({
  name: attr('string'),
  points: attr('number'),
  dob: attr('date')
});
```

In case you need a custom behavior, it's good to write your own [transform](http://emberjs.com/api/data/classes/DS.Transform.html).

## Help Wanted

| Issue | Link |
| :-- | :-- |
| ❌ Missing native JavaScript class support | [#560](https://github.com/ember-cli/eslint-plugin-ember/issues/560) |
