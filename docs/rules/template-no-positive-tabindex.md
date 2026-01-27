# ember/template-no-positive-tabindex

<!-- end auto-generated rule header -->

Disallows positive `tabindex` values.

Positive `tabindex` values disrupt the natural tab order of the page, making keyboard navigation confusing for users. This is especially problematic for users who rely on keyboard navigation, such as those with motor disabilities.

## Rule Details

This rule disallows positive integer values for the `tabindex` attribute. Only `0` (for naturally focusable elements) and `-1` (for programmatically focusable elements) are allowed.

## `<* tabindex>`

[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) explains the motivation of this rule nicely:

> Avoid using tabindex values greater than 0. Doing so makes it difficult for people who rely on assistive technology to navigate and operate page content. Instead, write the document with the elements in a logical sequence.

This rule prevents usage of any `tabindex` values other than `0` and `-1`. It does allow for dynamic values (choosing which value to show based on some condition / helper / etc), but only if that inline `if` condition has static `0`/`-1` as the value.

This rule takes no arguments.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div tabindex="1">Content</div>
</template>
```

```gjs
<template>
  <button tabindex="2">Click</button>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div tabindex="0">Content</div>
</template>
```

```gjs
<template>
  <div tabindex="-1">Content</div>
</template>
```

```gjs
<template>
  <button>Click</button>
</template>
```

## When Not To Use It

This rule should generally always be enabled for accessibility. However, if you have a specific use case where positive tabindex values are necessary and well-tested, you may disable it.

## References

- [eslint-plugin-ember template-no-positive-tabindex](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-positive-tabindex.md)
- [MDN tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex)
- [WebAIM: Keyboard Accessibility](https://webaim.org/techniques/keyboard/tabindex)
