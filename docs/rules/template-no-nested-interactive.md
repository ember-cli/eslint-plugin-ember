# ember/template-no-nested-interactive

💼 This rule is enabled in the 📋 `template-lint-migration` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Disallows nested interactive elements in templates.

Nested interactive elements (like a button inside a link) are not accessible to keyboard and screen reader users. This creates confusion about which element is actually interactive and can cause unexpected behavior.

## Rule Details

This rule disallows nesting interactive elements inside other interactive elements.

Interactive elements include:

- `<a>` (only when it has an `href` attribute)
- `<audio>` (only when it has a `controls` attribute)
- `<button>`
- `<canvas>` (drawing/game-UI convention; not in the HTML spec's interactive-content category)
- `<details>`
- `<embed>`
- `<iframe>`
- `<input>` (except `type="hidden"`)
- `<label>`
- `<select>`
- `<summary>`
- `<textarea>`
- `<video>` (only when it has a `controls` attribute)
- Elements with interactive ARIA roles (e.g., `role="button"`, `role="link"`)
- Elements with `tabindex` (unless `ignoreTabindex` is enabled)
- Elements with `contenteditable` (except `contenteditable="false"`)
- Elements with `usemap` (`<img>`, `<object>` only, unless `ignoreUsemap` is enabled)

Special cases:

- `<label>` may contain **one** interactive child (e.g., `<label><input /></label>` is fine, but `<label><input /><button>x</button></label>` is not)
- `<summary>` as the first child of `<details>` is allowed; other interactive content after `<summary>` (in the disclosed panel) is also allowed
- Canonical ARIA composite-widget hierarchies are allowed (e.g., `role="option"` inside `role="listbox"`, `role="tab"` inside `role="tablist"`, `role="row"` inside `role="grid"`, `role="radio"` inside `role="radiogroup"`). Derived from the ARIA `requiredOwnedElements` relationship.
- Nested `role="menuitem"` / `role="menuitemcheckbox"` / `role="menuitemradio"` elements are allowed (menu/sub-menu pattern)

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <button>
    <a href="#">Link inside button</a>
  </button>
</template>
```

```gjs
<template>
  <a href="#">
    <button>Button inside link</button>
  </a>
</template>
```

```gjs
<template>
  <label>
    <input type="text" />
    <button>Submit</button>
  </label>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div>
    <button>Button</button>
    <a href="#">Link</a>
  </div>
</template>
```

```gjs
<template>
  <label>
    <input type="text" />
    Label text
  </label>
</template>
```

```gjs
<template>
  <details>
    <summary>Toggle</summary>
    Content here
  </details>
</template>
```

```gjs
<template>
  <a>Not interactive without href</a>
</template>
```

## Options

| Name                        | Type       | Default | Description                                                   |
| --------------------------- | ---------- | ------- | ------------------------------------------------------------- |
| `additionalInteractiveTags` | `string[]` | `[]`    | Extra tag names to consider interactive.                      |
| `ignoredTags`               | `string[]` | `[]`    | Tag names to skip checking.                                   |
| `ignoreTabindex`            | `boolean`  | `false` | If `true`, `tabindex` does not make an element interactive.   |
| `ignoreUsemap`              | `boolean`  | `false` | If `true`, `usemap` does not make an element interactive.     |
| `ignoreUsemapAttribute`     | `boolean`  | `false` | Alias for `ignoreUsemap` (original ember-template-lint name). |

## References

- [eslint-plugin-ember template-no-nested-interactive](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-nested-interactive.md)
- [WCAG 2.1 - Interactive controls must not be nested](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)
