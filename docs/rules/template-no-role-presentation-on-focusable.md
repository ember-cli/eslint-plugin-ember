# ember/template-no-role-presentation-on-focusable

<!-- end auto-generated rule header -->

Disallow `role="presentation"` / `role="none"` on focusable elements.

`role="presentation"` and `role="none"` are intended to strip an element's semantics from the accessibility tree. However, when applied to a focusable element, user agents are **required to ignore** the presentation role — the element's native role and semantics are preserved by the browser ([WAI-ARIA 1.2 §4.6 Conflict Resolution](https://www.w3.org/TR/wai-aria-1.2/#conflict_resolution_presentation_none)). The author's intent (remove semantics) therefore conflicts with UA behavior (keep semantics), making the attribute misleading and the markup harder to reason about.

This rule flags the conflict so authors can either remove the `role` (if the native semantics are desired) or remove the focus vector (if the element genuinely should be presentational).

## Examples

This rule **forbids** the following:

```gjs
<template>
  <button role="presentation">Click</button>
  <a href="/x" role="none">Link</a>
  <input type="text" role="presentation" />
  <div tabindex="0" role="presentation">Focusable</div>
  {{! tabindex="-1" is also flagged — it makes the element programmatically focusable }}
  <div tabindex="-1" role="none">Programmatically focusable</div>
  {{! contenteditable (including valueless / mustache-boolean forms) is focusable }}
  <div contenteditable role="presentation">Editable</div>
  <div contenteditable={{true}} role="presentation">Editable</div>
</template>
```

This rule **allows** the following:

```gjs
<template>
  {{! Presentation on non-focusable elements }}
  <div role="presentation"></div>
  <span role="none" class="spacer"></span>

  {{! Presentation + aria-hidden — fully removed from AT }}
  <div role="presentation" aria-hidden="true"></div>

  {{! input type="hidden" isn't focusable }}
  <input type="hidden" role="presentation" />
</template>
```

## Focusability definition

Any element with a `tabindex` attribute — including `tabindex="-1"` — is considered focusable by this rule. `tabindex="-1"` removes an element from the sequential tab order but still makes it programmatically focusable (e.g. via `element.focus()`), which is exactly the kind of focus vector that creates the semantic conflict WAI-ARIA §4.6 describes. Elements with `contenteditable` (including the valueless form `<div contenteditable>` and mustache-boolean `contenteditable={{true}}`) are also considered focusable.

## Scope / Rationale

This rule inspects **only the element that carries the `role="presentation"` / `role="none"`** — it does not recurse into descendants. Per [WAI-ARIA 1.2 §4.6 Conflict Resolution](https://www.w3.org/TR/wai-aria-1.2/#conflict_resolution_presentation_none) and [§5.3.3 Document Structure](https://www.w3.org/TR/wai-aria-1.2/#document_structure_roles), `role="presentation"` / `role="none"` does **not** cascade to descendants — each descendant retains its own role and semantics.

As a result, wrapper patterns are **not flagged**:

```gjs
<template>
  {{! Not flagged: the div's role is a no-op (div had no meaningful role to
      suppress), and the button keeps its role + keyboard behavior. }}
  <div role="presentation">
    <button type="button">Click</button>
  </div>
</template>
```

This is a deliberate divergence from [eslint-plugin-vuejs-accessibility's `no-role-presentation-on-focusable`](https://github.com/vue-a11y/eslint-plugin-vuejs-accessibility/blob/main/docs/rules/no-role-presentation-on-focusable.md), which recurses into descendants and flags the wrapper case above. Vue's recursion is uncommented in their source and appears to have been copy-pasted from their `aria-hidden` rule, where descendant recursion **is** spec-correct because `aria-hidden` **does** cascade (see [`template-no-aria-hidden-on-focusable`](./template-no-aria-hidden-on-focusable.md)).

## References

- [WAI-ARIA 1.2 — presentation role](https://www.w3.org/TR/wai-aria-1.2/#presentation)
- [WAI-ARIA 1.2 §4.6 — Conflict Resolution for the `presentation` / `none` roles](https://www.w3.org/TR/wai-aria-1.2/#conflict_resolution_presentation_none)
- [WAI-ARIA 1.2 §5.3.3 — Document Structure Roles](https://www.w3.org/TR/wai-aria-1.2/#document_structure_roles)
- [`no-role-presentation-on-focusable` — eslint-plugin-vuejs-accessibility](https://github.com/vue-a11y/eslint-plugin-vuejs-accessibility/blob/main/docs/rules/no-role-presentation-on-focusable.md)
