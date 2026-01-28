# template-no-bare-yield

✅ The `extends: 'plugin:ember/strict-gjs'` or `extends: 'plugin:ember/strict-gts'` property in a configuration file enables this rule.

Disallow `{{yield}}` without parameters outside of contextual components.

## Rule Details

This rule enforces passing parameters to `{{yield}}` to make component APIs more explicit.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{yield}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  {{yield this}}
</template>

<template>
  {{yield @model}}
</template>
```

## Config

<!-- begin auto-generated rule meta list -->
- strictGjs: true
- strictGts: true
<!-- end auto-generated rule meta list -->
