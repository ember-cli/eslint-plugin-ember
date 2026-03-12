# ember/template-no-obscure-array-access

<!-- end auto-generated rule header -->

Disallow obscure array access patterns in templates.

## Rule Details

This rule discourages the use of obscure array access patterns in templates, including:

- Numeric array index access like `{{list.[0]}}` or `{{list.[1].name}}`
- `@each` property access like `{{items.@each.name}}`
- `[]` property access like `{{items.[].property}}`

Using obscure expressions like `{{list.[1].name}}` is discouraged. This rule recommends the use of Ember's `get` helper as an alternative for accessing array values.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <Foo @bar={{@list.[0]}} />
</template>
```

```gjs
<template>
  {{@list.[1].name}}
</template>
```

```gjs
<template>
  {{items.@each.name}}
</template>
```

```gjs
<template>
  {{items.[].property}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <Foo @bar={{get @list '0'}} />
</template>
```

```gjs
<template>
  {{get @list '1.name'}}
</template>
```

```gjs
<template>
  {{#each items as |item|}}
    {{item.name}}
  {{/each}}
</template>
```

## References

- [eslint-plugin-ember template-no-obscure-array-access](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-obscure-array-access.md)
