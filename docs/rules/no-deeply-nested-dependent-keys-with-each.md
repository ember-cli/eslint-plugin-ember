# ember/no-deeply-nested-dependent-keys-with-each

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Disallows usage of deeply-nested computed property dependent keys with `@each`.

For performance / complexity reasons, Ember does not allow deeply-nested computed property dependent keys with `@each`. At runtime, it will show a warning about this:

> WARNING: Dependent keys containing @each only work one level deep. You used the key `"foo.@each.bar.baz"` which is invalid. Please create an intermediary computed property.

## Examples

Examples of **incorrect** code for this rule:

```js
export default Component.extend({
  displayNames: computed('todos.@each.owner.name', function () {
    return this.todos.map((todo) => todo.owner.name);
  })
});
```

Examples of **correct** code for this rule:

```js
export default Component.extend({
  displayNames: computed('owners.@each.name', function () {
    return this.owners.mapBy('name');
  }),

  owners: computed('todos.@each.owner', function () {
    return this.todos.mapBy('owner');
  })
});
```

## Further Reading

- See the [documentation](https://guides.emberjs.com/release/object-model/computed-properties-and-aggregate-data/) for Ember computed properties with `@each`
