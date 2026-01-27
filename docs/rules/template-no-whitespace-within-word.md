# ember/template-no-whitespace-within-word

<!-- end auto-generated rule header -->

✅ The `extends: 'plugin:ember/strict-gjs'` and `extends: 'plugin:ember/strict-gts'` property in a configuration file enables this rule.

Disallow whitespace within mustache and block expressions.

## Rule Details

This rule disallows extra whitespace immediately after opening or before closing mustache/block delimiters.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{ value}}
</template>

<template>
  {{value }}
</template>

<template>
  {{ value }}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  {{value}}
</template>

<template>
  {{this.property}}
</template>

<template>
  {{#if condition}}content{{/if}}
</template>
```

## References

- [eslint-plugin-ember template-no-whitespace-within-word](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-whitespace-within-word.md)
