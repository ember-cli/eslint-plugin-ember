# ember/template-simple-unless

<!-- end auto-generated rule header -->

Require simple conditions in `{{#unless}}` blocks. Complex expressions should use `{{#if}}` with negation instead.

## Rule Details

This rule enforces using simple property paths in `{{#unless}}` blocks rather than complex helper expressions.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{#unless (eq value 1)}}
    Not one
  {{/unless}}
</template>

<template>
  {{#unless (or a b)}}
    Neither
  {{/unless}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  {{#unless isHidden}}
    Visible
  {{/unless}}
</template>

<template>
  {{#if (not (eq value 1))}}
    Not one
  {{/if}}
</template>
```

## Options

| Name         | Type       | Default | Description                                                                 |
| ------------ | ---------- | ------- | --------------------------------------------------------------------------- |
| `allowlist`  | `string[]` | `[]`    | Helper names allowed inside `{{unless}}`.                                   |
| `denylist`   | `string[]` | `[]`    | Helper names explicitly denied inside `{{unless}}`.                         |
| `maxHelpers` | `integer`  | `1`     | Maximum number of helpers allowed inside `{{unless}}` (`-1` for unlimited). |
