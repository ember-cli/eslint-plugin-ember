# ember/template-no-multiple-empty-lines

<!-- end auto-generated rule header -->

Disallows multiple consecutive empty lines in templates.

Multiple consecutive blank lines reduce readability and should be limited.

## Rule Details

This rule enforces a maximum number of consecutive empty lines (default: 1).

## Configuration

The following values are valid configuration:

- object -- An object with the following keys:
  - `max` -- An integer specifying the maximum number of consecutive empty lines allowed. Defaults to `1`.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div>First</div>


  <div>Second</div>
</template>
```

```gjs
<template>
  <div>Content</div>



  <div>More content</div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div>First</div>

  <div>Second</div>
</template>
```

```gjs
<template>
  <div>Content</div>
  <div>More content</div>
</template>
```

## References

- [eslint-plugin-ember template-no-multiple-empty-lines](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-multiple-empty-lines.md)
- [ESLint no-multiple-empty-lines](https://eslint.org/docs/rules/no-multiple-empty-lines)
