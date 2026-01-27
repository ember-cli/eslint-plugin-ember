# ember/template-link-href-attributes

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Requires `href` attribute on `<a>` elements.

Anchor elements should have an `href` attribute to be properly recognized as links by browsers and assistive technologies. If an element is meant to be interactive but not navigate, use a `<button>` instead.

## Rule Details

This rule ensures that all `<a>` elements have an `href` attribute.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <a>Link</a>
</template>
```

```gjs
<template>
  <a onclick={{this.handleClick}}>Click me</a>
</template>
```

```gjs
<template>
  <a role="button">Action</a>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <a href="/about">About Us</a>
</template>
```

```gjs
<template>
  <a href="https://example.com">External Link</a>
</template>
```

```gjs
<template>
  <button {{on "click" this.handleClick}}>Click me</button>
</template>
```

## References

- [MDN: The Anchor element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a)
- [WebAIM: Links and Hypertext](https://webaim.org/techniques/hypertext/)
- [ember-template-lint link-href-attributes](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/link-href-attributes.md)
