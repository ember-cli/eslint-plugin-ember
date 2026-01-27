# ember/template-eol-last

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Requires or disallows newline at the end of template files.

Consistent handling of line endings at the end of files helps maintain clean diffs in version control.

## Rule Details

This rule enforces a newline (or lack thereof) at the end of template blocks.

## Examples

Examples of **incorrect** code for this rule with default `"always"` option:

```gjs
// Missing newline at end
<template>
  <div>Hello</div>
</template>
```

Examples of **correct** code for this rule with default `"always"` option:

```gjs
<template>
  <div>Hello</div>
</template>

```

Examples of **incorrect** code for this rule with `"never"` option:

```gjs
// Unwanted newline at end
<template>
  <div>Hello</div>
</template>

```

Examples of **correct** code for this rule with `"never"` option:

```gjs
<template>
  <div>Hello</div>
</template>
```

## Configuration

This rule takes one option:

- `"always"` (default): requires a newline at the end
- `"never"`: disallows a newline at the end

```js
module.exports = {
  rules: {
    'ember/template-eol-last': ['error', 'always'],
  },
};
```

## References

- [ember-template-lint eol-last](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/eol-last.md)
- [ESLint eol-last](https://eslint.org/docs/rules/eol-last)
