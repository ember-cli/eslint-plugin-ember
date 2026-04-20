# ember/template-no-unsupported-role-attributes

💼 This rule is enabled in the 📋 `template-lint-migration` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Many ARIA states and properties are only available to elements with particular roles. This ensures that the appropriate information gets exposed to a browser's accessibility API for the given element.

This rule disallows the use of ARIA properties unsupported by an element's defined role. An element's role may either be explicitly set by the `role` attribute, or it may be implicitly defined through the use of HTML elements with inherent roles. For example, `<input type="checkbox"` has the implicit role of `checkbox`.

## Examples

This rule **forbids** the following:

```gjs
<template>
  <div role="link" href="#" aria-checked />
  <input type="checkbox" aria-invalid="grammar" />
  <CustomComponent role="listbox" aria-level="2" />
</template>
```

This rule **allows** the following:

```gjs
<template>
  <div role="heading" aria-level="1" />
  <input type="image" aria-atomic />
  <CustomComponent role="textbox" aria-required="true" />
</template>
```

## References

- [Using ARIA, Roles, States, and Properties](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques)
