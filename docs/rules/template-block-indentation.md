# ember/template-block-indentation

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Enforces consistent block indentation in templates.

This is a stylistic rule that is disabled by default.

## Rule Details

This rule enforces consistent indentation for block statements in templates.

## Examples

Examples of **correct** code for this rule:

```gjs
<template>
  {{#if condition}}
    <div>Content</div>
  {{/if}}
</template>
```

```gjs
<template>
  <div>Content</div>
</template>
```

## References

- [ember-template-lint block-indentation](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/block-indentation.md)
