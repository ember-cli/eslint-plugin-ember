# ember/template-require-mandatory-role-attributes

💼 This rule is enabled in the 📋 `template-lint-migration` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Elements with ARIA roles must also include all required attributes for that
role. This ensures that a given element possesses the necessary states and
properties to behave consistently with user expectations for other elements
with the same ARIA role.

This rule enforces that elements with an ARIA role also declare all required
ARIA attributes for that role.

## Examples

This rule **forbids** the following:

```gjs
<template>
  <div role="option" />
  <CustomComponent role="checkbox" aria-required="true" />
  {{some-component role="heading"}}
</template>
```

This rule **allows** the following:

```gjs
<template>
  <div role="option" aria-selected="false" />
  <CustomComponent role="checkbox" aria-required="true" aria-checked="false" />
  {{some-component role="heading" aria-level="2"}}

  {{! Native inputs supply required ARIA state for matching roles. Lookup is
      based on axobject-query's elementAXObjects + AXObjectRoles (see below). }}
  <input type="checkbox" role="switch" />
  <input type="checkbox" role="checkbox" />
  <input type="radio" role="radio" />
  <input type="range" role="slider" />
</template>
```

## Semantic-role exemptions

When the role attribute explicitly declares a role that the native element already provides, the native element supplies the required ARIA state and the rule does not flag missing attributes. The exemption is looked up via [axobject-query](https://github.com/A11yance/axobject-query)'s `elementAXObjects` + `AXObjectRoles` maps, matching the approach used by `eslint-plugin-jsx-a11y` and `@angular-eslint/template`.

Exempt pairings include (non-exhaustive):

| Element                   | Role                 | Required ARIA state supplied by                  |
| ------------------------- | -------------------- | ------------------------------------------------ |
| `<input type="checkbox">` | `checkbox`, `switch` | native `checked` state                           |
| `<input type="radio">`    | `radio`              | native `checked` state                           |
| `<input type="range">`    | `slider`             | native `value` / `min` / `max`                   |
| `<input type="number">`   | `spinbutton`         | native `value` (spinbutton has no required ARIA) |
| `<input type="text">`     | `textbox`            | no required ARIA                                 |
| `<input type="search">`   | `searchbox`          | no required ARIA                                 |

Undocumented pairings (e.g. `<input type="checkbox" role="menuitemcheckbox">` — axobject-query does not list this) remain flagged.

## References

- [WAI-ARIA Roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
- [WAI-ARIA APG — Switch pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)
- [HTML-AAM — `<input type="checkbox">` → `checkbox` role mapping](https://www.w3.org/TR/html-aam-1.1/#el-input-checkbox)
  — primary-spec source: the native element's accessibility mapping supplies
  the required ARIA state via the `checked` IDL attribute, which is what
  axobject-query encodes.
- [axobject-query](https://github.com/A11yance/axobject-query) — AX-tree data source for the exemption lookup (secondary, encodes HTML-AAM)
