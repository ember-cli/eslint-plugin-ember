# ember/template-require-aria-activedescendant-tabindex

💼 This rule is enabled in the 📋 `template-lint-migration` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule requires non-interactive HTML elements using the `aria-activedescendant` attribute to declare a `tabindex` of `0` or `-1`.

The `aria-activedescendant` attribute identifies the active descendant element of a composite widget, textbox, group, or application with document focus. This attribute is placed on the container element of the input control, and its value is set to the ID of the active child element. This allows screen readers to communicate information about the currently active element as if it has focus, while actual focus of the DOM remains on the container element.

Elements with `aria-activedescendant` must be focusable to support keyboard navigation. `tabindex="0"` puts the element in the natural tab order; `tabindex="-1"` makes it focusable programmatically (e.g. via roving focus) but skips it in the tab order. Both are valid patterns for composite widgets — see the [W3C APG — Managing focus in composites using aria-activedescendant](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_focus_activedescendant).

## Examples

This rule **forbids** the following:

```gjs
<template>
  <div aria-activedescendant='some-id'></div>
  <div aria-activedescendant='some-id' tabindex='-2'></div>
  <input aria-activedescendant={{some-id}} tabindex='-100' />
</template>
```

This rule **allows** the following:

```gjs
<template>
  <CustomComponent />
  <CustomComponent aria-activedescendant={{some-id}} />
  <CustomComponent aria-activedescendant={{some-id}} tabindex={{0}} />
  <div aria-activedescendant='some-id' tabindex='0'></div>
  <div aria-activedescendant='some-id' tabindex='-1'></div>
  <input />
  <input aria-activedescendant={{some-id}} />
  <input aria-activedescendant={{some-id}} tabindex={{0}} />
  <input aria-activedescendant={{some-id}} tabindex={{-1}} />
</template>
```

## References

- [MDN, Using the aria-activedescendant attribute(property)](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-activedescendant_attribute)
- [WAI-aria: aria-activedescendant(property](https://www.digitala11y.com/aria-activedescendant-properties/)
- [aria-activedescendant-has-tabindex - eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/aria-activedescendant-has-tabindex.md)
