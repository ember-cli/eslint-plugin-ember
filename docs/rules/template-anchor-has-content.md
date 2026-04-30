# ember/template-anchor-has-content

<!-- end auto-generated rule header -->

Requires every `<a href>` anchor to expose a non-empty accessible name to assistive technology.

An anchor with no text, no accessible-name attribute (`aria-label`, `aria-labelledby`, `title`), and no accessible children (e.g. an `<img>` with non-empty `alt`) is rendered by screen readers as an empty link. Users have no way to tell what the link does.

## Rule Details

The rule only inspects plain `<a>` elements that have an `href` attribute. Component invocations (PascalCase, `@arg`, `this.foo`, `foo.bar`, `foo::bar`) are skipped — the rule cannot see through a component's implementation.

For each in-scope anchor the rule computes whether the element exposes an accessible name:

- A non-empty `aria-label`, `aria-labelledby`, or `title` on the anchor itself is an accessible name (any non-static / dynamic value is trusted).
- Static text (including text nested inside child elements) is an accessible name.
- `<img alt="...">` children contribute their `alt` to the name.
- Children with `aria-hidden="true"` (or `{{true}}`) contribute nothing, even if they contain text or `alt`. Valueless / empty-string `aria-hidden` resolves to the default `undefined` per the WAI-ARIA value table and is treated as not-hidden — those children still contribute.
- Dynamic content (`{{@foo}}`, `{{this.foo}}`, `{{#if ...}}`) is treated as opaque: the rule does not flag the anchor because it cannot know what will render.

## Examples

This rule **allows** the following:

```gjs
<template>
  <a href="/about">About us</a>
  <a href="/x"><span>Profile</span></a>
  <a href="/x" aria-label="Close" />
  <a href="/x" title="Open menu" />
  <a href="/x"><img alt="Search" /></a>
  <a href="/x">{{@label}}</a>
  <a href="/x"><span aria-hidden>Profile</span></a>
  <Link href="/x" />
</template>
```

This rule **forbids** the following:

```gjs
<template>
  <a href="/x" />
  <a href="/x"></a>
  <a href="/x">   </a>
  <a href="/x"><span aria-hidden="true">X</span></a>
  <a href="/x"><img aria-hidden="true" alt="Search" /></a>
  <a href="/x"><img /></a>
  <a href="/x" aria-label="" />
</template>
```

## References

- [W3C: Accessible Name and Description Computation (accname)](https://www.w3.org/TR/accname/)
- [MDN: The Anchor element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a)
- [WCAG 2.4.4 — Link Purpose (In Context)](https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html)
- [jsx-a11y/anchor-has-content](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/anchor-has-content.md)
- [vuejs-accessibility/anchor-has-content](https://github.com/vue-a11y/eslint-plugin-vuejs-accessibility/blob/main/docs/rules/anchor-has-content.md)
