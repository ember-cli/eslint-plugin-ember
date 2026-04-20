# ember/template-require-button-type

💼 This rule is enabled in the 📋 `template-lint-migration` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule requires all `<button>` elements to have a valid `type` attribute.

By default, the `type` attribute of `<button>` elements is `submit`. This can
be very confusing, when a button component is developed in isolation without
`type="button"`, and when inside a `<form>` element it suddenly starts to
submit the form.

## Examples

This rule **forbids** the following:

```gjs
<template>
  <button>Hello World!</button>
  <button type=''>Hello World!</button>
  <button type='invalid'>Hello World!</button>
</template>
```

This rule **allows** the following:

```gjs
<template>
  <button type='button'>Hello World!</button>
  <button type='submit'>Hello World!</button>
  <button type='reset'>Hello World!</button>
</template>
```

## References

- [HTML spec - the button element](https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type)
