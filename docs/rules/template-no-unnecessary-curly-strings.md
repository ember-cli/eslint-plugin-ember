# ember/template-no-unnecessary-curly-strings

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Strings in attribute values need not be wrapped in curly braces (mustache expressions).

## Rule Details

This rule detects attribute values that use mustache expressions for simple string literals, which can be replaced with plain string attribute values.

Note: This rule only checks **attribute values**, not text content.

## Examples

This rule **forbids** the following:

```gjs
<template><FooBar class={{'btn'}} /></template>
```

This rule **allows** the following:

```gjs
<template><FooBar class='btn' /></template>
```

```gjs
<template><FooBar class='btn'>Hello</FooBar></template>
```

## References

- [Handlebars expressions](https://handlebarsjs.com/guide/expressions.html)
