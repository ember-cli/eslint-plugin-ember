# ember/template-no-negated-comparison

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Disallows negated comparison operators in templates.

## Rule Details

Use positive comparison operators with `{{unless}}` instead of negated comparison operators like `not-eq` or `ne`.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{#if (not-eq this.value 5)}}
    Not equal
  {{/if}}
</template>
```

```gjs
<template>
  {{#if (ne this.a this.b)}}
    Not equal
  {{/if}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  {{#unless (eq this.value 5)}}
    Not equal
  {{/unless}}
</template>
```

```gjs
<template>
  {{#if (eq this.value 5)}}
    Equal
  {{/if}}
</template>
```

## References

- [ember-template-lint no-negated-condition](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-negated-condition.md)
