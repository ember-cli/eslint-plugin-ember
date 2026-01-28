# ember/template-no-positive-tabindex

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Disallows positive `tabindex` values.

Positive `tabindex` values disrupt the natural tab order of the page, making keyboard navigation confusing for users. This is especially problematic for users who rely on keyboard navigation, such as those with motor disabilities.

## Rule Details

This rule disallows positive integer values for the `tabindex` attribute. Only `0` (for naturally focusable elements) and `-1` (for programmatically focusable elements) are allowed.

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

- [ember-template-lint no-positive-tabindex](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-positive-tabindex.md)
- [MDN tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex)
- [WebAIM: Keyboard Accessibility](https://webaim.org/techniques/keyboard/tabindex)
