# ember/template-no-html-comments

<!-- end auto-generated rule header -->

✅ The `extends: 'plugin:ember/strict-gjs'` or `extends: 'plugin:ember/strict-gts'` property in a configuration file enables this rule.

Disallow HTML comments in templates. HTML comments will be visible in the rendered output, which may expose sensitive information or clutter the DOM.

## Rule Details

This rule disallows HTML comments (`<!-- -->`) in templates and suggests using Glimmer comments (`{{! }}` or `{{!-- --}}`) instead.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <!-- This is an HTML comment -->
  <div>Content</div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  {{! This is a Glimmer comment }}
  <div>Content</div>
</template>

<template>
  {{!-- This is a block Glimmer comment --}}
  <div>Content</div>
</template>
```

<!-- begin auto-generated rule meta list -->

- strictGjs: true
- strictGts: true
<!-- end auto-generated rule meta list -->
