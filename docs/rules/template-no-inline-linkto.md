# ember/template-no-inline-linkto

<!-- end auto-generated rule header -->

Disallows inline form of the LinkTo component.

## Rule Details

The inline form of `<LinkTo>` (self-closing without content) should be avoided. Use the block form instead to provide link text.

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

## References

- [eslint-plugin-ember template-no-inline-link-to](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-inline-link-to.md)
