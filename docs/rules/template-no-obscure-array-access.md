# ember/template-no-obscure-array-access

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

✅ The `extends: 'plugin:ember/strict-gjs'` or `extends: 'plugin:ember/strict-gts'` property in a configuration file enables this rule.

Disallow obscure array access patterns like `objectPath.@each.property` or `objectPath.[].property` in templates.

## Rule Details

This rule discourages the use of `@each` and `[]` property access patterns in templates, which can be obscure and difficult to understand. Instead, use computed properties, helpers, or explicit iteration.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{items.@each.name}}
</template>
```

```gjs
<template>
  {{users.@each.isActive}}
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
  {{#each items as |item|}}
    {{item.name}}
  {{/each}}
</template>
```

```gjs
<template>
  {{get items 0}}
</template>
```

```gjs
<template>
  {{this.itemNames}}
</template>
```

## References

- [ember-template-lint: no-obscure-array-access](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-obscure-array-access.md)

<!-- begin auto-generated rule meta list -->
- strictGjs: true
- strictGts: true
<!-- end auto-generated rule meta list -->
