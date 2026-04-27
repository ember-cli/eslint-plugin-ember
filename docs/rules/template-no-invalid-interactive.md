# ember/template-no-invalid-interactive

💼 This rule is enabled in the 📋 `template-lint-migration` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

> Disallow non-interactive elements with interactive handlers

## Rule Details

This rule prevents adding interactive event handlers (like `onclick`, `onkeydown`, etc.) to non-interactive HTML elements without proper ARIA roles.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div onclick={{this.handleClick}}>Click me</div>
</template>
```

```gjs
<template>
  <span onkeydown={{this.handleKey}}>Press key</span>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <button onclick={{this.handleClick}}>Click me</button>
</template>
```

```gjs
<template>
  <div role="button" onclick={{this.handleClick}}>Click me</div>
</template>
```

```gjs
<template>
  <button {{on "click" this.handleClick}}>Click me</button>
</template>
```

## Escape hatches

An element opts out of this rule's handler-on-non-interactive check in two cases:

- **`aria-hidden="true"`** (including valueless / empty / `{{true}}` / `{{"true"}}` forms) — the author has explicitly removed the element from the accessibility tree, so a "non-interactive element with handler" is moot; AT users won't encounter it either way. Explicit `aria-hidden="false"` / `{{false}}` still flags.
- **`role="presentation"` / `role="none"`** — the author asserts the element is decorative. We accept `role="presentation"` and `role="none"` (case-insensitive, first recognized token of a space-separated role list per WAI-ARIA first-recognized-token rule) — a deliberate superset of [jsx-a11y's exact-match `hasPresentationRole`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/src/util/hasPresentationRole.js) for consistency with [WAI-ARIA 1.2 §4.1](https://www.w3.org/TR/wai-aria-1.2/#host_general_role) role-fallback semantics.

The valueless `aria-hidden` case (e.g. `<div aria-hidden>`) is [genuinely contested](https://www.scottohara.me/blog/2018/05/05/hidden-vs-none.html) — jsx-a11y, vue-a11y, axe-core, and the WAI-ARIA spec take four different positions on whether it counts as "hidden". This rule leans toward fewer false positives: flagging a handler on an author-decorated element creates friction more often than it catches real bugs.

### Related checks outside this rule's scope

- **`role="presentation"` on focusable elements** — per [WAI-ARIA 1.2 §4.6 Conflict Resolution](https://www.w3.org/TR/wai-aria-1.2/#conflict_resolution_presentation_none), browsers ignore `role="presentation"` on focusable elements. [axe-core's `presentation-role-conflict`](https://dequeuniversity.com/rules/axe/4.10/presentation-role-conflict) flags this pattern as an authoring error. This rule does not detect the conflict: the escape hatch check runs before `isInteractive(node)`, so a focusable element with `role="presentation"` returns early and is silently exempted. Interactive-handler cases on plain `<button>` / `<a href>` etc. are still flagged normally when they lack the presentation/none opt-out. If you want to catch the authoring error itself (role=presentation on a focusable element, which has no effect at runtime), layer axe-core or a dedicated rule on top.
- **Click handler on a non-focusable decorated element** — e.g. `<div role="presentation" {{on "click"}}>`. Our escape hatch silences this by design (jsx-a11y-compat). [axe-core's `click-events-have-key-events`](https://dequeuniversity.com/rules/axe/4.10/click-events-have-key-events) is the complementary check. If you want strictness, layer it on top.

## Options

| Name                        | Type       | Default | Description                                                 |
| --------------------------- | ---------- | ------- | ----------------------------------------------------------- |
| `additionalInteractiveTags` | `string[]` | `[]`    | Extra tag names to treat as interactive.                    |
| `ignoredTags`               | `string[]` | `[]`    | Tag names to skip checking.                                 |
| `ignoreTabindex`            | `boolean`  | `false` | If `true`, `tabindex` does not make an element interactive. |
| `ignoreUsemap`              | `boolean`  | `false` | If `true`, `usemap` does not make an element interactive.   |

## References

- [WCAG 2.1 - 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)
- [eslint-plugin-ember template-no-invalid-interactive](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-invalid-interactive.md)
