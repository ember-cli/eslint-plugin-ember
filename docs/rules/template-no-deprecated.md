# ember/template-no-deprecated

<!-- end auto-generated rule header -->

Disallows using Glimmer components, helpers, or modifiers that are marked `@deprecated` in their JSDoc.

This rule requires TypeScript (`parserServices.program` must be present). It is a no-op in plain `.gjs` files because cross-file import deprecations require type information.

## Rule Details

This rule checks if imported Glimmer components, helpers, or modifiers are marked `@deprecated` in their JSDoc.

**Covered syntax:**

| Template syntax         | Example                                     |
| ----------------------- | ------------------------------------------- |
| Component element       | `<DeprecatedComponent />`                   |
| Helper / value mustache | `{{deprecatedHelper}}`                      |
| Block component         | `{{#DeprecatedBlock}}…{{/DeprecatedBlock}}` |
| Modifier                | `<div {{deprecatedModifier}}>`              |

**Not covered:** `<MyComp @deprecatedArg={{x}}>` — argument names are not scope-registered by the parser.

## Examples

Given a module:

```ts
// deprecated-component.ts
/** @deprecated use NewComponent instead */
export default class DeprecatedComponent {}
```

Examples of **incorrect** code for this rule:

```gts
import DeprecatedComponent from './deprecated-component';

<template>
  <DeprecatedComponent />
</template>
```

```gts
import { deprecatedHelper } from './deprecated-helper';

<template>
  {{deprecatedHelper}}
</template>
```

Examples of **correct** code for this rule:

```gts
import NewComponent from './new-component';

<template>
  <NewComponent />
</template>
```
