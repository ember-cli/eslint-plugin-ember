# ember/template-no-unnecessary-curly-strings

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): ✅ `recommended`, ![gjs logo](/docs/svgs/gjs.svg) `recommended-gjs`, ![gts logo](/docs/svgs/gts.svg) `recommended-gts`, 📋 `template-lint-migration`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Strings need not be wrapped in curly braces (mustache expressions).

## Examples

This rule **forbids** the following:

```gjs
<template><FooBar class={{"btn"}} /></template>
```

```gjs
<template><FooBar class="btn">{{"Hello"}}</FooBar></template>
```

This rule **allows** the following:

```gjs
<template><FooBar class="btn" /></template>
```

```gjs
<template><FooBar class="btn">Hello</FooBar></template>
```

## References

- [Handlebars expressions](https://handlebarsjs.com/guide/expressions.html)
