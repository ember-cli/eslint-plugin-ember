# ember/template-no-aria-hidden-body

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

The aria-hidden attribute should never be present on the `<body>` element, as it hides the entire document from assistive technology.

## Examples

This rule **forbids** the following:

```gjs
<template><body aria-hidden></template>
```

```gjs
<template><body aria-hidden="true"></template>
```

This rule **allows** the following:

```gjs
<template><body></template>
```

## References

- [Using the aria-hidden attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-hidden_attribute)
- [How Lighthouse identifies hidden body elements](https://web.dev/aria-hidden-body/)
- [WCAG 4.1.2 - Name, Role, Value (Level A)](https://www.w3.org/TR/WCAG21/#name-role-value)
