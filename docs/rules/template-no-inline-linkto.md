# ember/template-no-inline-linkto

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

## References

- [eslint-plugin-ember template-no-inline-link-to](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-inline-link-to.md)
