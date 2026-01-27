# ember/template-simple-unless

<!-- end auto-generated rule header -->

✅ The `extends: 'plugin:ember/strict-gjs'` or `extends: 'plugin:ember/strict-gts'` property in a configuration file enables this rule.

Require simple conditions in `{{#unless}}` blocks. Complex expressions should use `{{#if}}` with negation instead.

## Rule Details

This rule enforces using simple property paths in `{{#unless}}` blocks rather than complex helper expressions.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{#unless (eq value 1)}}
    Not one
  {{/unless}}
</template>

<template>
  {{#unless (or a b)}}
    Neither
  {{/unless}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  {{#unless isHidden}}
    Visible
  {{/unless}}
</template>

<template>
  {{#if (not (eq value 1))}}
    Not one
  {{/if}}
</template>
```

<!-- begin auto-generated rule meta list -->

- strictGjs: true
- strictGts: true
<!-- end auto-generated rule meta list -->
