# ember/template-no-html-comments

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

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
