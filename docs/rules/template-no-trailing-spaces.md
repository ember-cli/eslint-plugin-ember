# ember/template-no-trailing-spaces

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallows trailing whitespace at the end of lines.

Trailing whitespace is unnecessary and can cause issues with version control systems, where it may be flagged as changes.

## Rule Details

This rule detects and removes trailing spaces or tabs at the end of lines.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template> 
  <div>Hello</div>
</template>
```

```gjs
<template>
  <div>Hello</div>  
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div>Hello</div>
</template>
```

## References

- [ember-template-lint no-trailing-spaces](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-trailing-spaces.md)
