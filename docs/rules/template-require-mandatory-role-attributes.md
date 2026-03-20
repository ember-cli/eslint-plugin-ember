# ember/template-require-mandatory-role-attributes

<!-- end auto-generated rule header -->

Elements with ARIA roles must also include all required attributes for that
role. This ensures that a given element possesses the necessary states and
properties to behave consistently with user expectations for other elements
with the same ARIA role.

This rule enforces that elements with an ARIA role also declare all required
ARIA attributes for that role.

## Examples

This rule **forbids** the following:

```gjs
<template>
  <div role="option" />
  <CustomComponent role="checkbox" aria-required="true" />
  {{some-component role="heading"}}
</template>
```

This rule **allows** the following:

```gjs
<template>
  <div role="option" aria-selected="false" />
  <CustomComponent role="checkbox" aria-required="true" aria-checked="false" />
  {{some-component role="heading" aria-level="2"}}
</template>
```

## References

- [WAI-ARIA Roles - Accessibility \_ MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
