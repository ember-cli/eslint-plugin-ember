# ember/template-no-negated-comparison

<!-- end auto-generated rule header -->

> **Note**: This rule is NOT a port of `ember-template-lint`'s `no-negated-condition`.
> That rule prefers `not-eq` over `if/else`; this rule bans `not-eq` (and similar) entirely.
> These are opposite goals.

Disallows negated comparison operators in templates.

## Rule Details

Use positive comparison operators with `{{unless}}` instead of negated comparison operators like `not-eq`.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{#if (not-eq this.value 5)}}
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
