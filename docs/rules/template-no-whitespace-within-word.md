# template-no-whitespace-within-word

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

- [Ember Template Lint - no-whitespace-within-word](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-whitespace-within-word.md)
