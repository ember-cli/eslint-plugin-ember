# ember/template-quotes

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Enforces consistent quote style in templates.

This is a stylistic rule that is disabled by default.

## Rule Details

This rule enforces consistent usage of double or single quotes in templates.

## Config

This rule accepts either a string or an object.

### String form

`"double"` or `"single"` — applies to both HTML attributes and Handlebars string literals.

### Object form

| Name      | Type                                | Default | Description                                                            |
| --------- | ----------------------------------- | ------- | ---------------------------------------------------------------------- |
| `curlies` | `"double"` \| `"single"` \| `false` | `false` | Quote style for Handlebars string literals. `false` disables checking. |
| `html`    | `"double"` \| `"single"` \| `false` | `false` | Quote style for HTML attribute values. `false` disables checking.      |

```js
module.exports = {
  rules: {
    'ember/template-quotes': ['error', { html: 'double', curlies: 'single' }],
  },
};
```

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

- [eslint-plugin-ember template-quotes](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-quotes.md)
