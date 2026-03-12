# ember/template-no-link-to-tagname

<!-- end auto-generated rule header -->

> Disallow tagName attribute on LinkTo component

## Rule Details

The `tagName` attribute on `<LinkTo>` components is deprecated. Use the appropriate HTML element or component instead.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <LinkTo @route="index" tagName="button">Home</LinkTo>
</template>
```

```gjs
<template>
  <LinkTo @route="about" @tagName="span">About</LinkTo>
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
  <button type="button" {{on "click" (fn this.transitionTo "index")}}>Home</button>
</template>
```

## Migration

- Remove the `tagName` overrides and, if you need it, adjust the styling of the
  `<a>` elements to make them look like buttons

## Related rules

- [no-input-tagname](template-no-input-tagname.md)
- [no-unknown-arguments-for-builtin-components](template-no-unknown-arguments-for-builtin-components.md)

## References

- [eslint-plugin-ember template-no-link-to-tagname](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-link-to-tagname.md)
