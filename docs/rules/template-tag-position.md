# ember/template-tag-position

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

> Enforce where `<template>` appears in classes in `.gjs`/`.gts` files.

## Rule Details

When using template tags in class bodies, keeping `<template>` in a consistent place makes components easier to scan.

This rule enforces that `<template>` appears either:

- `'after'` class members (default)
- `'before'` class members

## Examples

Examples of **incorrect** code with the default `'after'` option:

```gjs
class Demo extends Component {
  <template>{{this.message}}</template>

  message = 'hello';
}
```

Examples of **correct** code with the default `'after'` option:

```gjs
class Demo extends Component {
  message = 'hello';

  <template>{{this.message}}</template>
}
```

## Options

- `'after'` (default): `<template>` comes after all other class members.
- `'before'`: `<template>` comes before all other class members.
