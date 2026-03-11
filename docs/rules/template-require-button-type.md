# ember/template-require-button-type

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Requires button elements to have a valid `type` attribute.

The default behavior of buttons in forms is to submit the form. This can lead to unexpected behavior if not explicitly set. This rule ensures that all `<button>` elements have a `type` attribute with a valid value.

## Rule Details

This rule requires all `<button>` elements to have a `type` attribute set to one of: `"button"`, `"submit"`, or `"reset"`.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <button>Click me</button>
</template>
```

```gjs
<template>
  <button type="invalid">Click</button>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <button type="button">Click me</button>
</template>
```

```gjs
<template>
  <button type="submit">Submit Form</button>
</template>
```

```gjs
<template>
  <button type="reset">Reset Form</button>
</template>
```

## When Not To Use It

If you are certain about button behaviors in your application and don't want to enforce explicit types, you may disable this rule.

## References

- [eslint-plugin-ember template-require-button-type](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-require-button-type.md)
- [MDN button type attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type)
