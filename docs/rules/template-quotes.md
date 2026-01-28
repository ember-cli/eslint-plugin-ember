# ember/template-quotes

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Enforces consistent quote style in templates.

This is a stylistic rule that is disabled by default.

## Rule Details

This rule enforces consistent usage of double or single quotes in templates.

## Config

This rule takes one option, a string which must be either `"double"` or `"single"`. The default is `"double"`.

## Examples

Examples of **correct** code for this rule:

```gjs
<template>
  <div class="foo"></div>
</template>
```

```gjs
<template>
  <MyComponent @arg="value" />
</template>
```

## References

- [ember-template-lint quotes](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/quotes.md)
