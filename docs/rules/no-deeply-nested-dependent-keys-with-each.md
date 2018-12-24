# Disallows usage of deeply-nested computed property dependent keys with `@each`.  (no-deeply-nested-dependent-keys-with-each)

For performance / complexity reasons, Ember does allow deeply-nested computed property dependent keys with `@each`. At runtime, it will show a warning about this:

> WARNING: Dependent keys containing @each only work one level deep. You used the key "foo.@each.bar.baz" which is invalid. Please create an intermediary computed property.

## Rule Details

Examples of **incorrect** code for this rule:

```js
displayNames: computed('todos.@each.owner.name', function() {
  return this.todos.map(todo => todo.owner.name);
})
```

Examples of **correct** code for this rule:

```js
displayNames: computed('owners.@each.name', function() {
  return this.owners.mapBy(owners, 'name');
}),

owners: computed('todos.@each.owner', function() {
  return this.todos.mapBy(todo, 'owner');
})
```

## Further Reading

* See the [documentation](https://guides.emberjs.com/release/object-model/computed-properties-and-aggregate-data/) for Ember computed properties with `@each`
