# ember/template-no-inline-linkto

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallows inline form of the LinkTo component.

## Rule Details

The inline form of `<LinkTo>` (self-closing without content) should be avoided. Use the block form instead to provide link text.

This rule also disallows the curly `{{link-to}}` inline form (e.g., `{{link-to "text" "route"}}`). The block form `{{#link-to}}...{{/link-to}}` or `<LinkTo>` angle bracket syntax should be used instead.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <LinkTo @route="index" />
</template>
```

```gjs
<template>
  <LinkTo @route="about"></LinkTo>
</template>
```

```gjs
<template>
  {{link-to "Link text" "routeName"}}
</template>
```

```gjs
<template>
  {{link-to "Link text" "routeName" prop1 prop2}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <LinkTo @route="index">Home</LinkTo>
</template>
```

```gjs
<template>
  <LinkTo @route="about">
    About Us
  </LinkTo>
</template>
```

```gjs
<template>
  {{#link-to "routeName" prop1 prop2}}Link text{{/link-to}}
</template>
```

```gjs
// User-authored `<LinkTo>` (not from `@ember/routing`) is not flagged in
// strict mode, even when childless.
import LinkTo from './my-link-to-component';
<template>
  <LinkTo />
</template>
```

## Strict-mode behavior

In `.gjs`/`.gts` strict mode, `<LinkTo>` only refers to Ember's router link when explicitly imported from `@ember/routing` (this also covers renamed imports such as `import { LinkTo as Link } from '@ember/routing'`). Without that import, `<LinkTo>` is treated as a user-authored component and the rule does not fire. The curly `{{link-to ...}}` form is unreachable in strict mode (`link-to` cannot be a JS identifier) and the autofix is skipped there.

## References

- [eslint-plugin-ember template-no-inline-link-to](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-inline-link-to.md)
