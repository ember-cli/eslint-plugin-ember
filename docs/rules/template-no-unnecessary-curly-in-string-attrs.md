# ember/template-no-unnecessary-curly-in-string-attrs

<!-- end auto-generated rule header -->

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
