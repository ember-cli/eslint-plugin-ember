# ember/template-no-link-to-positional-params

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): ✅ `recommended`, ![gjs logo](/docs/svgs/gjs.svg) `recommended-gjs`, ![gts logo](/docs/svgs/gts.svg) `recommended-gts`, 📋 `template-lint-migration`.

<!-- end auto-generated rule header -->

> Disallow positional params in LinkTo component

## Rule Details

Positional parameters in `<LinkTo>` components are deprecated. Use named arguments instead.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{! Old positional params style }}
  <LinkTo "posts.post" @model={{this.post}}>Post</LinkTo>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <LinkTo @route="posts.post" @model={{this.post}}>Post</LinkTo>
</template>
```

```gjs
<template>
  <LinkTo @route="index">Home</LinkTo>
</template>
```

## References

- [eslint-plugin-ember template-no-link-to-positional-params](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-link-to-positional-params.md)
