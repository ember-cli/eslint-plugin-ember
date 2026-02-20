# ember/template-no-invalid-link-title

<!-- end auto-generated rule header -->

Disallow invalid `title` attributes on link elements. The title should not be empty or the same as the link text.

## Rule Details

This rule ensures that link titles provide additional context and are not redundant with the link text.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <a href="/page" title="">Page</a>
</template>

<template>
  <a href="/page" title="Page">Page</a>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <a href="/page" title="More information about page">Page</a>
</template>

<template>
  <a href="/page">Page</a>
</template>
```
