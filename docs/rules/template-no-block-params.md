# template-no-block-params

> Disallow yielding/invoking a component block without parameters

## Rule Details

This rule prevents declaring block parameters when a component doesn't yield any values.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <MyComponent as |unused|>
    Content
  </MyComponent>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <MyComponent>
    Content
  </MyComponent>
</template>
```

```gjs
<template>
  <MyComponent as |item|>
    {{item.name}}
  </MyComponent>
</template>
```

## References

- [ember-template-lint no-unused-block-params](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-unused-block-params.md)
