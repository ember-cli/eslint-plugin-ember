# ember/template-require-splattributes

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Require splattributes usage in component templates.

Ember components should accept and forward HTML attributes to their underlying elements. This is done using the `...attributes` spread syntax.

## Examples

This rule **forbids** the following:

```gjs
<template>
  <div></div>
</template>
```

```gjs
<template>
  <div></div>
  <div></div>
</template>
```

This rule **allows** the following:

```gjs
<template>
  <div ...attributes></div>
</template>
```

```gjs
<template>
  <div ...attributes></div>
  <div></div>
</template>
```

## Why?

Components that don't use `...attributes` cannot accept HTML attributes from their consumers, limiting the flexibility and reusability of components. The `...attributes` syntax ensures that consumers can pass attributes like `class`, `id`, `aria-*`, and others to your component.

## References

- [Ember.js Guides - Splattributes](https://guides.emberjs.com/release/components/component-arguments-and-html-attributes/#toc_html-attributes)
