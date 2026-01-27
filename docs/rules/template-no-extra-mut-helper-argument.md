# ember/template-no-extra-mut-helper-argument

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Disallows passing more than one argument to the `mut` helper.

A common mistake when using the Ember handlebars template `mut(attr)` helper is to pass an extra `value` parameter to it when only `attr` should be passed. Instead, the `value` should be passed outside of `mut`.

## Examples

This rule **forbids** the following:

```gjs
<template>{{my-component click=(action (mut isClicked true))}}</template>
```

This rule **allows** the following:

```gjs
<template>{{my-component click=(action (mut isClicked) true)}}</template>
```

## Related Rules

- [template-no-mut-helper](template-no-mut-helper.md)

## References

- See the [documentation](https://emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/mut?anchor=mut) for the Ember handlebars template `mut` helper
