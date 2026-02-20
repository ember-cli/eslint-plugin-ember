# ember/template-deprecated-render-helper

<!-- end auto-generated rule header -->

Disallows the {{render}} helper which is deprecated.

## Examples

Incorrect:

```gjs
<template>{{render "user"}}</template>
```

Correct:

```gjs
<template><User /></template>
```

## References

- [eslint-plugin-ember template-deprecated-render-helper](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-deprecated-render-helper.md)
