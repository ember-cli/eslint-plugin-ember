# ember/template-require-valid-named-block-naming-format

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): ✅ `recommended`, `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Require valid named block naming format.

Named blocks in `yield` and `has-block` helpers should follow a consistent naming format.

## Examples

This rule **forbids** the following (with default camelCase):

```hbs
<template>
  {{yield to='foo-bar'}}
</template>
```

```hbs
<template>
  {{has-block 'foo-bar'}}
</template>
```

This rule **allows** the following (with default camelCase):

```hbs
<template>
  {{yield to='fooBar'}}
</template>
```

```hbs
<template>
  {{has-block 'fooBar'}}
</template>
```

## Configuration

- `camelCase` (default) - Named blocks should use camelCase format
- `kebab-case` - Named blocks should use kebab-case format

```js
// .eslintrc.js
module.exports = {
  rules: {
    'ember/template-require-valid-named-block-naming-format': ['error', 'camelCase'],
  },
};
```

## References

- [Ember.js Guides - Named Blocks](https://guides.emberjs.com/release/components/template-syntax/#toc_named-blocks)
