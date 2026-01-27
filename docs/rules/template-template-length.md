# ember/template-template-length

<!-- end auto-generated rule header -->

Enforce template size constraints.

Very long templates can indicate that markup should be split into smaller components.
Very short templates can indicate that markup might be better inlined.

## Config

This rule accepts either:

- `true` / `false`
- an object with:
  - `max` (integer): maximum allowed template length in lines
  - `min` (integer): minimum allowed template length in lines

Using `true` defaults to:

- `max: 200`
- `min: 5`

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div>short</div>
</template>
```

with config:

```json
{ "min": 10 }
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div>line 1</div>
  <div>line 2</div>
  <div>line 3</div>
</template>
```

## References

- [eslint-plugin-ember template-length](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-template-length.md)
- [eslint/max-lines](https://eslint.org/docs/latest/rules/max-lines)
