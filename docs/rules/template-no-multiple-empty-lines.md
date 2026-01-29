# ember/template-no-multiple-empty-lines

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Disallows multiple consecutive empty lines in templates.

Multiple consecutive blank lines reduce readability and should be limited.

## Rule Details

This rule enforces a maximum number of consecutive empty lines (default: 1).

## Config

This rule accepts an object with a `max` property to specify the maximum number of consecutive empty lines allowed:

```json
{
  "rules": {
    "ember/template-no-multiple-empty-lines": ["error", { "max": 1 }]
  }
}
```

- `max` (default: `1`): Maximum number of consecutive empty lines allowed

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

- [ember-template-lint no-multiple-empty-lines](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-multiple-empty-lines.md)
- [ESLint no-multiple-empty-lines](https://eslint.org/docs/rules/no-multiple-empty-lines)
