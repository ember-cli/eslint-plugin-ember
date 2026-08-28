# ember/template-no-aria-hidden-on-focusable

<!-- end auto-generated rule header -->

Disallow `aria-hidden="true"` on focusable elements or elements containing focusable descendants.

An element with `aria-hidden="true"` is removed from the accessibility tree but remains keyboard-focusable. This creates a keyboard trap — users reach the element via Tab but can't perceive it. The same applies to focusable descendants of an `aria-hidden` ancestor, since `aria-hidden` does not remove elements from the tab order.

Per [WAI-ARIA 1.2 — aria-hidden](https://www.w3.org/TR/wai-aria-1.2/#aria-hidden):

> Authors SHOULD NOT use `aria-hidden="true"` on any element that has focus or may receive focus, either directly via interaction with the user or indirectly via programmatic means such as JavaScript-based event handling.

The phrase "may receive focus" is interpreted to include focusable descendants: `aria-hidden` cascades to hide the entire subtree from assistive tech, while any focusable descendant within that subtree remains reachable via Tab — landing keyboard users on AT-invisible content.

## Examples

This rule **forbids** the following:

```gjs
<template>
  <button aria-hidden="true">Trapped</button>
  <a href="/x" aria-hidden="true">Link</a>
  <div tabindex="0" aria-hidden="true">Focusable but hidden</div>

  {{! Focusable descendant inside an aria-hidden ancestor — classic modal backdrop trap }}
  <div aria-hidden="true">
    <button>Close</button>
  </div>
</template>
```

This rule **allows** the following:

```gjs
<template>
  {{! Non-focusable decorative content }}
  <div aria-hidden="true"><svg class="decoration" /></div>

  {{! Explicit opt-out }}
  <button aria-hidden="false">Click me</button>

  {{! input type="hidden" is not focusable }}
  <input type="hidden" aria-hidden="true" />

  {{! Component/dynamic descendants are opaque — conservatively not flagged }}
  <div aria-hidden="true"><CustomBtn /></div>
</template>
```

## Caveats

Component invocations, argument/`this`/path-based tags, and namespace-pathed
tags are "opaque" — we can't statically know what they render. The descendant
check skips these branches to avoid false positives. If a component renders a
focusable element beneath an `aria-hidden` ancestor, the keyboard trap still
exists at runtime; this rule can't detect it.

Custom elements (hyphenated tags like `<my-widget>`) are similarly skipped: we
can't know whether their shadow DOM defines a focusable region. If
`<my-widget aria-hidden="true">` renders a focusable element internally, the
trap still exists at runtime — this rule can't detect it.

Dynamic content inside `{{...}}` mustache statements is similarly not inspected.

## References

- [WAI-ARIA 1.2 — aria-hidden](https://www.w3.org/TR/wai-aria-1.2/#aria-hidden)
- [WebAIM — Hiding content from assistive tech](https://webaim.org/techniques/css/invisiblecontent/)
- [`no-aria-hidden-on-focusable` — eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-aria-hidden-on-focusable.md)
- [`no-aria-hidden-on-focusable` — eslint-plugin-vuejs-accessibility](https://github.com/vue-a11y/eslint-plugin-vuejs-accessibility/blob/main/docs/rules/no-aria-hidden-on-focusable.md)
