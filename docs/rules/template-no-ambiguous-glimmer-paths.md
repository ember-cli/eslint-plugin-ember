# ember/template-no-ambiguous-glimmer-paths

<!-- end auto-generated rule header -->

> **HBS Only**: This rule applies to classic `.hbs` template files only (loose mode). It is not relevant for `gjs`/`gts` files (strict mode), where these patterns cannot occur.

Disallow ambiguous path in templates

## Rule Details

This rule requires explicit `this.` or `@` prefix for property access to avoid ambiguity.

## Examples

Examples of **incorrect** code for this rule:

```hbs
{{user.name}}
```

```hbs
{{model.title}}
```

Examples of **correct** code for this rule:

```hbs
{{this.user.name}}
```

```hbs
{{@model.title}}
```

```hbs
{{MyComponent}}
```

## References

- [eslint-plugin-ember template-no-implicit-this](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-implicit-this.md)
