# ember/template-no-invalid-aria-attributes

💼 This rule is enabled in the 📋 `template-lint-migration` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Disallow invalid ARIA attributes. Only use valid ARIA attributes as defined in the ARIA specification.

## Rule Details

This rule validates that only standard ARIA attributes are used on elements.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div aria-fake="value">Content</div>
</template>

<template>
  <div aria-invalid-attr="value">Content</div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div aria-label="Label">Content</div>
</template>

<template>
  <div aria-hidden="true">Content</div>
</template>

<template>
  <div aria-describedby="description-id">Content</div>
</template>
```

HTML custom elements (tags with a hyphen that start lowercase) are skipped —
their accessibility contracts are defined by the component author and cannot
be validated against the ARIA spec:

```gjs
<template>
  <my-widget aria-bogus="x" />
</template>
```

## References

- [Using ARIA, Roles, States, and Properties](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques)
