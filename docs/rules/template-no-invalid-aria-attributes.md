# template-no-invalid-aria-attributes

✅ The `extends: 'plugin:ember/strict-gjs'` or `extends: 'plugin:ember/strict-gts'` property in a configuration file enables this rule.

Disallow invalid ARIA attributes. Only use valid ARIA attributes as defined in the ARIA specification.

## Rule Details

This rule validates that only standard ARIA attributes are used on elements.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div aria-fake="value">Content</div>
</template>

<template>
  <div aria-invalid-attr="value">Content</div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div aria-label="Label">Content</div>
</template>

<template>
  <div aria-hidden="true">Content</div>
</template>

<template>
  <div aria-describedby="description-id">Content</div>
</template>
```

## Config

<!-- begin auto-generated rule meta list -->
- strictGjs: true
- strictGts: true
<!-- end auto-generated rule meta list -->
