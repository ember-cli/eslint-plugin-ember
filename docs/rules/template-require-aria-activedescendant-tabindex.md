# ember/template-require-aria-activedescendant-tabindex

<!-- end auto-generated rule header -->

Requires elements with `aria-activedescendant` to be tabbable (have tabindex attribute).

When using `aria-activedescendant` to manage focus within a composite widget, the element with this attribute must be focusable. This is achieved by adding a `tabindex` attribute.

## Rule Details

This rule ensures that any element with the `aria-activedescendant` attribute also has a `tabindex` attribute, making it keyboard accessible.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div aria-activedescendant="item-1">
    <div id="item-1">Item 1</div>
  </div>
</template>
```

```gjs
<template>
  <ul aria-activedescendant="option-1">
    <li id="option-1">Option 1</li>
  </ul>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div aria-activedescendant="item-1" tabindex="0">
    <div id="item-1">Item 1</div>
  </div>
</template>
```

```gjs
<template>
  <ul aria-activedescendant="option-1" tabindex="-1">
    <li id="option-1">Option 1</li>
  </ul>
</template>
```

## References

- [ARIA: aria-activedescendant](https://www.w3.org/TR/wai-aria-1.2/#aria-activedescendant)
- [Managing Focus with aria-activedescendant](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_focus_activedescendant)
- [eslint-plugin-ember template-require-aria-activedescendant-tabindex](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-require-aria-activedescendant-tabindex.md)
