# ember/template-require-strict-mode

<!-- end auto-generated rule header -->

Require templates to be in strict mode.

Templates should use the strict mode syntax (template tag format) rather than loose template files. Strict mode templates (`.gjs` / `.gts` files) provide better integration with JavaScript and type checking.

## Examples

This rule **forbids** the following:

```hbs
<div>
  Hello World
</div>
```

(in a `.hbs` file)

This rule **allows** the following:

```hbs
<template>
  Hello World
</template>
```

(in a `.gjs` or `.gts` file)

## Why?

Strict mode templates provide:

- Better integration with JavaScript tooling
- Type safety in TypeScript projects
- Clearer component boundaries
- Easier refactoring and navigation

## References

- [Ember.js Guides - Template Syntax](https://guides.emberjs.com/release/templates/syntax/)
