# ember/template-no-ambiguous-glimmer-paths

<!-- end auto-generated rule header -->

> Disallow ambiguous path in templates

## Rule Details

This rule requires explicit `this.` or `@` prefix for property access to avoid ambiguity.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{user.name}}
</template>
```

```gjs
<template>
  {{model.title}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  {{this.user.name}}
</template>
```

```gjs
<template>
  {{@model.title}}
</template>
```

```gjs
<template>
  {{MyComponent}}
</template>
```

## References

- [eslint-plugin-ember template-no-implicit-this](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-implicit-this.md)
