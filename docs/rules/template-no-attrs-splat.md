# template-no-attrs-splat

> Disallow attribute splat on components

## Rule Details

Using `...attrs` is deprecated in favor of `...attributes`.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div {{...attrs}}>Content</div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div ...attributes>Content</div>
</template>
```

## References

- [ember-template-lint no-attrs-in-components](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-attrs-in-components.md)
