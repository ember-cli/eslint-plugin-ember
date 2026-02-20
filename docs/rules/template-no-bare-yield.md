# ember/template-no-bare-yield

<!-- end auto-generated rule header -->

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
