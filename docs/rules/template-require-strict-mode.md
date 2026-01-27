# ember/template-require-strict-mode

> **HBS Only**: This rule applies to classic `.hbs` template files only (loose mode). It is not relevant for `gjs`/`gts` files (strict mode), where these patterns cannot occur.

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
Hello World
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
