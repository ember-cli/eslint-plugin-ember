# ember/template-no-this-in-template-only-components

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

There is no `this` context in template-tag (`<template>`) components that don't extend a class.

## Rule Details

In gjs/gts files with `<template>` tags, this rule flags all `this.*` path expressions and suggests converting them to named arguments (`@*`). The auto-fix replaces `this.foo` with `@foo` (except for built-in component properties like `elementId`, `tagName`, `ariaRole`, `class`, `classNames`, `classNameBindings`, `attributeBindings`, and `isVisible`, which are reported but not auto-fixed).

## Examples

This rule **forbids** the following:

```gjs
<template><h1>Hello {{this.name}}!</h1></template>
```

This rule **allows** the following:

```gjs
<template><h1>Hello {{@name}}!</h1></template>
```

The `--fix` option will convert to named arguments:

```gjs
<template><h1>Hello {{@name}}!</h1></template>
```

## Migration

- use [ember-no-implicit-this-codemod](https://github.com/ember-codemods/ember-no-implicit-this-codemod)
- [upgrade to Glimmer components](https://guides.emberjs.com/release/upgrading/current-edition/glimmer-components/), which don't allow ambiguous access
  - classic components have [auto-reflection](https://github.com/emberjs/rfcs/blob/master/text/0276-named-args.md#motivation), and can use `this.myArgName` or `this.args.myArgNme` or `@myArgName` interchangeably

## References

- [Glimmer components](https://guides.emberjs.com/release/upgrading/current-edition/glimmer-components/)
- [rfcs/named args](https://github.com/emberjs/rfcs/blob/master/text/0276-named-args.md#motivation)
