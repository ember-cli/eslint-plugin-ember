# ember/template-no-negated-condition

<!-- end auto-generated rule header -->

✅ The `extends: 'plugin:ember/strict-gjs'` or `extends: 'plugin:ember/strict-gts'` property in a configuration file enables this rule.

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

<!-- begin auto-generated rule meta list -->

- strictGjs: true
- strictGts: true
<!-- end auto-generated rule meta list -->
