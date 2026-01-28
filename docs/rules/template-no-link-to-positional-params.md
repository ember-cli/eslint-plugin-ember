# template-no-link-to-positional-params

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

- [ember-template-lint no-link-to-positional-params](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-link-to-positional-params.md)
