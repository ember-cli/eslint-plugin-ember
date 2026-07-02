# ember/no-legacy-helper-imports

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Since Ember 7.1, the most common utility helpers and modifiers are available in strict-mode templates (`.gjs` / `.gts`) as built-in keywords, without an import:

`and`, `array`, `element`, `eq`, `fn`, `gt`, `gte`, `hash`, `lt`, `lte`, `neq`, `not`, `on`, `or`

This rule flags imports that are superseded by those keywords:

| Import                                             | Keyword                                                                 |
| -------------------------------------------------- | ----------------------------------------------------------------------- |
| `ember-truth-helpers` (and its `/helpers/*` paths) | `eq`, `neq` (was `notEq`), `not`, `and`, `or`, `gt`, `gte`, `lt`, `lte` |
| `ember-element-helper`                             | `element`                                                               |
| `@ember/helper`                                    | `array`, `hash`, `fn`                                                   |
| `@ember/modifier`                                  | `on`                                                                    |

Other exports of `@ember/helper` and `@ember/modifier` (such as `helper`, `concat`, `get`, `uniqueId`, `setModifierManager`) are not flagged.

This rule does nothing when the installed `ember-source` version is below 7.1.

## Rule Details

The autofix removes the superseded specifiers (dropping the whole import when nothing is left) and renames usages to the keyword name where it differs, e.g. `notEq` → `neq` or an aliased local back to its keyword.

The autofix is skipped when it cannot be done safely:

- the binding is referenced in JavaScript code (the keywords only exist inside `<template>` tags), or
- renaming a usage would collide with another in-scope binding named like the keyword.

The import is still reported in those cases; it just has to be migrated by hand.

## Examples

Examples of **incorrect** code for this rule:

```gjs
import { eq, notEq as isDifferent } from 'ember-truth-helpers';

<template>
  {{eq a b}}
  {{isDifferent a b}}
</template>
```

```gjs
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';

<template>
  <button type="button" {{on "click" (fn this.save item)}}>Save</button>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  {{eq a b}}
  {{neq a b}}
  <button type="button" {{on "click" (fn this.save item)}}>Save</button>
</template>
```

```gjs
import { helper } from '@ember/helper';

export default helper(([a, b]) => a + b);
```

## References

- [RFC #997](https://github.com/emberjs/rfcs/pull/997), [RFC #998](https://github.com/emberjs/rfcs/pull/998), [RFC #999](https://github.com/emberjs/rfcs/pull/999), [RFC #1000](https://github.com/emberjs/rfcs/pull/1000) — the RFCs that made these helpers and modifiers built-in keywords
- [Ember built-in helpers guide](https://guides.emberjs.com/release/components/helper-functions/#toc_built-in-helpers)
