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

- [ember-template-lint deprecated-render-helper](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/deprecated-render-helper.md)
