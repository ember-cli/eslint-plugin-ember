# ember/template-no-duplicate-attributes

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): ![gjs logo](/docs/svgs/gjs.svg) `recommended-gjs`, ![gts logo](/docs/svgs/gts.svg) `recommended-gts`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallows duplicate attribute names in templates.

Duplicate attributes on the same element can lead to unexpected behavior and are often a mistake.

## Rule Details

This rule disallows duplicate attributes on HTML elements, components, and helpers.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div class="foo" class="bar"></div>
</template>
```

```gjs
<template>
  <input type="text" disabled type="email" />
</template>
```

```gjs
<template>
  {{helper foo="bar" foo="baz"}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div class="foo bar"></div>
</template>
```

```gjs
<template>
  <input type="email" disabled />
</template>
```

```gjs
<template>
  {{helper foo="bar" baz="qux"}}
</template>
```

## References

- [ember-template-lint no-duplicate-attributes](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-duplicate-attributes.md)
