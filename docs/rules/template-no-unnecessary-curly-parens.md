# ember/template-no-unnecessary-curly-parens

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

✅ The `extends: 'plugin:ember/strict-gjs'` or `extends: 'plugin:ember/strict-gts'` property in a configuration file enables this rule.

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

- [ember-template-lint: no-unnecessary-curly-parens](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-unnecessary-curly-parens.md)

<!-- begin auto-generated rule meta list -->
- strictGjs: true
- strictGts: true
<!-- end auto-generated rule meta list -->
