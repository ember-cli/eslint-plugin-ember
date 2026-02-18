# ember/template-no-attribute-splat-on-html-element

<!-- end auto-generated rule header -->

Disallows using `...attributes` on HTML elements.

## Rule Details

The `...attributes` syntax should only be used on component elements, not on HTML elements, to avoid confusion and maintain clear component boundaries.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div ...attributes></div>
</template>
```

```gjs
<template>
  <span ...attributes></span>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <MyComponent ...attributes />
</template>
```

```gjs
<template>
  <div class="wrapper"></div>
</template>
```

## References

- [eslint-plugin-ember no-attrs-in-components](https://github.com/eslint-plugin-ember/eslint-plugin-ember/blob/master/docs/rule/no-attrs-in-components.md)
