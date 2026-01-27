# ember/template-no-negated-comparison

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

- [eslint-plugin-ember template-no-negated-condition](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-negated-condition.md)
