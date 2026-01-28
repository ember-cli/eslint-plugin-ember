# ember/template-eol-last

💡 This rule is _not_ enabled in any [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations) by default.

🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

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
    'ember/template-eol-last': ['error', 'always']
  }
};
```

## References

- [ember-template-lint eol-last](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/eol-last.md)
- [ESLint eol-last](https://eslint.org/docs/rules/eol-last)
