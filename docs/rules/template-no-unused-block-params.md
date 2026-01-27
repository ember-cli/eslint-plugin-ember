# ember/template-no-unused-block-params

<!-- end auto-generated rule header -->

Disallow unused block parameters in templates.

## Rule Details

This rule reports block parameters that are declared but never used within the block.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{#each items as |item|}}
    Hello
  {{/each}}
</template>

<template>
  {{#each items as |item index|}}
    {{item.name}}
  {{/each}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  {{#each items as |item|}}
    {{item.name}}
  {{/each}}
</template>

<template>
  {{#each items as |item index|}}
    {{index}}: {{item.name}}
  {{/each}}
</template>

<template>
  {{#let user as |u|}}
    {{u.name}}
  {{/let}}
</template>
```

## References

- [Ember Guides - Block Parameters](https://guides.emberjs.com/release/components/block-content/)
