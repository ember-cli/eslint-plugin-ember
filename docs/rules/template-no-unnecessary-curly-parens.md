# ember/template-no-unnecessary-curly-parens

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallow unnecessary curlies around simple values in templates. This is a stylistic rule that promotes cleaner template code. It only flags simple single identifiers without path separators or parameters.

## Rule Details

This rule discourages the use of mustache curlies `{{}}` around simple single identifiers when they could potentially be expressed more simply.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{value}}
</template>
```

```gjs
<template>
  {{name}}
</template>
```

```gjs
<template>
  {{count}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  {{helper param}}
</template>
```

```gjs
<template>
  {{#if condition}}text{{/if}}
</template>
```

```gjs
<template>
  {{this.property}}
</template>
```

## References

- [eslint-plugin-ember template-no-unnecessary-curly-parens](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-unnecessary-curly-parens.md)
