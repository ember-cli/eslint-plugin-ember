# ember/template-require-lang-attribute

<!-- end auto-generated rule header -->

Requires that the `<html>` element has a `lang` attribute.

The `lang` attribute helps assistive technologies determine the language of the page content, which is important for proper pronunciation and translation services.

## Rule Details

This rule requires that all `<html>` elements have a `lang` attribute.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <html>
    <body>Content</body>
  </html>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <html lang="en">
    <body>Content</body>
  </html>
</template>
```

```gjs
<template>
  <html lang="es">
    <body>Contenido</body>
  </html>
</template>
```

```gjs
<template>
  <div>No html element present</div>
</template>
```

## Options

| Name             | Type      | Default | Description                                                                       |
| ---------------- | --------- | ------- | --------------------------------------------------------------------------------- |
| `validateValues` | `boolean` | `true`  | When `true`, validates that the `lang` value is a recognized BCP 47 language tag. |

## References

- [eslint-plugin-ember template-require-lang-attribute](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-require-lang-attribute.md)
- [WCAG 2.1 - Language of Page](https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html)
- [MDN - lang attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang)
