# ember/template-no-empty-headings

💼 This rule is enabled in the 📋 `template-lint-migration` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Headings relay the structure of a webpage and provide a meaningful, hierarchical order of its content. If headings are empty or its text contents are inaccessible, this could confuse users or prevent them accessing sections of interest.

Disallow headings (h1, h2, etc.) with no accessible text content.

## Examples

This rule **forbids** the following:

```gjs
<template><h*></h*></template>
```

```gjs
<template><div role='heading' aria-level='1'></div></template>
```

```gjs
<template><h*><span aria-hidden='true'>Inaccessible text</span></h*></template>
```

This rule **allows** the following:

```gjs
<template><h*>Heading Content</h*></template>
```

```gjs
<template><h*><span>Text</span><h*></template>
```

```gjs
<template><div role='heading' aria-level='1'>Heading Content</div></template>
```

```gjs
<template><h* aria-hidden='true'>Heading Content</h*></template>
```

```gjs
<template><h* hidden>Heading Content</h*></template>
```

## Migration

If violations are found, remediation should be planned to ensure text content is present and visible and/or screen-reader accessible. Setting `aria-hidden="false"` or removing `hidden` attributes from the element(s) containing heading text may serve as a quickfix.

## Notes on `aria-hidden` semantics

This rule follows [WAI-ARIA 1.2 §`aria-hidden`](https://www.w3.org/TR/wai-aria-1.2/#aria-hidden) verbatim: only an explicit truthy value hides the element. Ambiguous shapes — valueless `aria-hidden`, empty string, and mustache literals that resolve to an empty / whitespace-only string — all resolve to the default `undefined` and do NOT exempt the heading from the empty-content check.

- `aria-hidden="true"` / `aria-hidden={{true}}` / `aria-hidden={{"true"}}` (any case, whitespace-trimmed) → hidden, exempts the heading.
- `aria-hidden="false"` / `aria-hidden={{false}}` / `aria-hidden={{"false"}}` → not hidden, the empty-content check applies.
- `<h1 aria-hidden>` / `aria-hidden=""` / `aria-hidden={{""}}` / `aria-hidden={{" "}}` → spec-default `undefined`, the empty-content check applies.

## References

- [WCAG SC 2.4.6 Headings and Labels](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-descriptive.html)
