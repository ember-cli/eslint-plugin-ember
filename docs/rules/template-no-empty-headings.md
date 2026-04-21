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

This rule treats valueless / empty-string `aria-hidden` (`<h1 aria-hidden>` or `<h1 aria-hidden="">`) as exempting the heading from the empty-content check — those forms count as "hidden" for this rule.

**This is a deliberate deviation from [WAI-ARIA 1.2 §`aria-hidden`](https://www.w3.org/TR/wai-aria-1.2/#aria-hidden)**, which resolves valueless / empty-string `aria-hidden` to the default value `undefined` — not `true` — and therefore does not hide the element per spec. The spec-literal reading would say "valueless `aria-hidden` doesn't hide, so the empty heading is still a violation."

We lean toward fewer false positives here: if the author wrote `aria-hidden` at all, they signaled an intent to hide, and flagging the empty heading on top of what is already a malformed `aria-hidden` usage layers a second-order complaint on a first-order problem. Axe-core and the W3C ACT rules consistently treat this shape as INCOMPLETE (needs manual review) rather than a definitive failure, which is consistent with leaning away from a hard flag here.

For rules that ask the _opposite_ question ("is this element authoritatively hidden?"), the spec-literal reading applies — see e.g. `template-no-aria-hidden-on-focusable` and `template-anchor-has-content`, which treat valueless `aria-hidden` as **not** hidden. This split is applied per-rule, picking the interpretation that produces the fewest false positives for each specific check.

Unambiguous forms always follow the spec:

- `aria-hidden="true"` / `aria-hidden={{true}}` / `aria-hidden={{"true"}}` (any case) → hidden, exempts the heading.
- `aria-hidden="false"` / `aria-hidden={{false}}` / `aria-hidden={{"false"}}` → not hidden, the empty-content check still applies.

## References

- [WCAG SC 2.4.6 Headings and Labels](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-descriptive.html)
