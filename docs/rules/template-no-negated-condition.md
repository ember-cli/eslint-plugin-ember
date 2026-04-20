# ember/template-no-negated-condition

💼 This rule is enabled in the 📋 `template-lint-migration` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallow negated conditions in `{{#if}}` blocks. Use `{{#unless}}` instead or rewrite the condition.

## Rule Details

This rule discourages the use of `{{#if (not condition)}}` in favor of `{{#unless condition}}` for better readability.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{#if (not isValid)}}
    Invalid
  {{/if}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  {{#unless isValid}}
    Invalid
  {{/unless}}
</template>

<template>
  {{#if isValid}}
    Valid
  {{/if}}
</template>
```

## Options

| Name              | Type      | Default | Description                                                                                                             |
| ----------------- | --------- | ------- | ----------------------------------------------------------------------------------------------------------------------- |
| `simplifyHelpers` | `boolean` | `true`  | When `true`, also reports negated comparison helpers (e.g. `(not (eq ...))`) and suggests using `(not-eq ...)` instead. |

## Related Rules

- [simple-unless](template-simple-unless.md)

## References

- [no-negated-condition](https://eslint.org/docs/rules/no-negated-condition) from eslint
