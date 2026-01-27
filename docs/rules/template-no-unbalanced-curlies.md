# ember/template-no-unbalanced-curlies

<!-- end auto-generated rule header -->

✅ The `extends: 'plugin:ember/strict-gjs'` or `extends: 'plugin:ember/strict-gts'` property in a configuration file enables this rule.

Disallow unbalanced mustache curlies in templates.

## Rule Details

This rule detects unbalanced opening `{{` and closing `}}` mustache braces in templates, which typically indicates a syntax error or typo.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{value}
</template>
```

```gjs
<template>
  {{{value}}
</template>
```

```gjs
<template>
  {{#if condition}}
    {{value}
  {{/if}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  {{value}}
</template>
```

```gjs
<template>
  {{#if condition}}
    {{value}}
  {{/if}}
</template>
```

```gjs
<template>
  {{helper param1 param2}}
</template>
```

## References

- [eslint-plugin-ember template-no-unbalanced-curlies](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-unbalanced-curlies.md)

<!-- begin auto-generated rule meta list -->

- strictGjs: true
- strictGts: true
<!-- end auto-generated rule meta list -->
