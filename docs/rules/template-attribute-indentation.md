# ember/template-attribute-indentation

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Enforces consistent attribute indentation in templates.

This is a stylistic rule that is disabled by default.

## Rule Details

This rule enforces consistent indentation for attributes in template elements.

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

- [ember-template-lint attribute-indentation](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/attribute-indentation.md)
