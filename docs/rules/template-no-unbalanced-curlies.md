# ember/template-no-unbalanced-curlies

<!-- end auto-generated rule header -->

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

## Migration

If you have curlies in your code that you wish to show verbatim, but are flagged by this rule, you can formulate them as a handlebars expression:

```hbs
<p>This is a closing double curly: {{'}}'}}</p>
<p>This is a closing triple curly: {{'}}}'}}</p>
```

## References

- [eslint-plugin-ember template-no-unbalanced-curlies](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-unbalanced-curlies.md)
