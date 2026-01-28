# ember/template-no-attribute-splat-on-html-element

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

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

- [ember-template-lint no-attrs-in-components](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-attrs-in-components.md)
