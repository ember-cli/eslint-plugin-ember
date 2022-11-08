# ember/no-invalid-dependent-keys

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Dependent keys used for computed properties have to be valid.

## Rule Details

This rule aims to avoid invalid dependent keys in computed properties.

Currently implemented checks:

- Unbalanced open and closed braces. These can be hard to track for complex computed properties and are usually unchecked since the expressions are passed as Strings.
- Unnecessary braces
- Invalid position of `@each` or `[]`
- Leading or trailing periods

## Examples

Examples of **incorrect** code for this rule:

```js
export default Component.extend({
  // Unbalanced braces:
  fullName: computed('user.{firstName,lastName', {
    // Code
  })
});
```

```js
export default Component.extend({
  // Unnecessary braces:
  userId: computed('user.{id}', {
    // Code
  })
});
```

```js
export default Component.extend({
  // Terminal `@each`:
  items: computed('arr.@each', {
    // Code
  })
});
```

```js
export default Component.extend({
  // `[]` in the middle:
  items: computed('arr.[].id', {
    // Code
  })
});
```

```js
export default Component.extend({
  // Leading period:
  userId: computed('.user.id', {
    // Code
  })
});
```

```js
export default Component.extend({
  // Space:
  userId: computed('user .id', {
    // Code
  })
});
```

Examples of **correct** code for this rule:

```js
export default Component.extend({
  fullName: computed('user.{firstName,lastName}', {
    // Code
  })
});
```

```js
export default Component.extend({
  userId: computed('user.id', {
    // Code
  })
});
```

```js
export default Component.extend({
  items: computed('arr.[]', {
    // Code
  })
});
```

```js
export default Component.extend({
  items: computed('arr.@each.id', {
    // Code
  })
});
```

## References

- [Guide](https://guides.emberjs.com/release/object-model/computed-properties/) for computed properties
