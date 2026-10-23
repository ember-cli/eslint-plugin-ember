# ember/template-tag-spacing

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

> Require a blank line between class members and `<template>` in `.gjs`/`.gts` files.

## Rule Details

When using template tags in `.gjs`/`.gts` files, this rule requires an empty line between `<template>` and adjacent JavaScript/TypeScript code.

This applies both inside class bodies and at the file top level.

When `<template>` is in the middle of class members, prefer `ember/template-tag-position` to move it first. This rule intentionally avoids autofixing middle-placement cases to prevent overlapping fixes.

## Examples

Examples of **incorrect** code for this rule:

```gjs
class Demo extends Component {
  message = 'hello';
  <template>{{this.message}}</template>
}
```

Examples of **correct** code for this rule:

```gjs
class Demo extends Component {
  message = 'hello';

  <template>{{this.message}}</template>
}
```
