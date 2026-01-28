# ember/template-require-each-key

<!-- end auto-generated rule header -->

✅ The `extends: 'plugin:ember/strict-gjs'` or `extends: 'plugin:ember/strict-gts'` property in a configuration file enables this rule.

Require a `key` attribute in `{{#each}}` loops for better rendering performance and to avoid rendering issues.

## Rule Details

This rule enforces using a `key` attribute in `{{#each}}` blocks to help Ember track items efficiently.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{#each items as |item|}}
    <div>{{item.name}}</div>
  {{/each}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  {{#each items key="id" as |item|}}
    <div>{{item.name}}</div>
  {{/each}}
</template>

<template>
  {{#each items key="@index" as |item|}}
    <div>{{item.name}}</div>
  {{/each}}
</template>
```

<!-- begin auto-generated rule meta list -->
- strictGjs: true
- strictGts: true
<!-- end auto-generated rule meta list -->
