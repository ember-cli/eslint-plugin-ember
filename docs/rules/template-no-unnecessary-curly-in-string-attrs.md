# template-no-unnecessary-curly-in-string-attrs

✅ The `extends: 'plugin:ember/strict-gjs'` or `extends: 'plugin:ember/strict-gts'` property in a configuration file enables this rule.

Disallow unnecessary curly braces around string literals in attributes.

## Rule Details

This rule enforces using static strings directly instead of wrapping them in mustache syntax.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div class={{"static-class"}}>Content</div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div class="static-class">Content</div>
</template>

<template>
  <div class={{this.dynamicClass}}>Content</div>
</template>
```

## Config

<!-- begin auto-generated rule meta list -->
- strictGjs: true
- strictGts: true
<!-- end auto-generated rule meta list -->
