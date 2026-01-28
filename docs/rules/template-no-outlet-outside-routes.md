# ember/template-no-outlet-outside-routes

<!-- end auto-generated rule header -->

✅ The `extends: 'plugin:ember/strict-gjs'` or `extends: 'plugin:ember/strict-gts'` property in a configuration file enables this rule.

Disallow `{{outlet}}` outside of route templates. The `outlet` helper should only be used in route templates to render nested routes.

## Rule Details

This rule prevents the use of `{{outlet}}` in component templates where it doesn't make sense.

## Examples

Examples of **incorrect** code for this rule:

```gjs
// In a component template
<template>
  <div>
    {{outlet}}
  </div>
</template>
```

Examples of **correct** code for this rule:

```gjs
// In a component template
<template>
  <div>Content</div>
</template>
```

<!-- begin auto-generated rule meta list -->
- strictGjs: true
- strictGts: true
<!-- end auto-generated rule meta list -->
