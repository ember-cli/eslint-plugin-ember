# ember/template-no-link-to-tagname

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

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

## References

- [ember-template-lint no-link-to-tagname](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-link-to-tagname.md)
