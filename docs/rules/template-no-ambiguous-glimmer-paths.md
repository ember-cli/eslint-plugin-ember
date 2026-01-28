# template-no-ambiguous-glimmer-paths

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

- [ember-template-lint no-implicit-this](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-implicit-this.md)
