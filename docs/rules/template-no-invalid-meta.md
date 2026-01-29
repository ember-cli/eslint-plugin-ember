# ember/template-no-invalid-meta

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

Disallow invalid meta tags.

Meta tags should use proper encoding (UTF-8) for consistent cross-browser behavior and internationalization support.

## Rule Details

This rule enforces that meta charset tags use UTF-8 encoding.

## Examples

### Incorrect ❌

```gjs
<template>
  <meta charset="iso-8859-1" />
</template>
```

```gjs
<template>
  <meta charset="latin1" />
</template>
```

```gjs
<template>
  <meta charset="windows-1252" />
</template>
```

### Correct ✅

```gjs
<template>
  <meta charset="utf-8" />
</template>
```

```gjs
<template>
  <meta charset="UTF-8" />
</template>
```

```gjs
<template>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</template>
```

## References

- [MDN - Meta charset](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-charset)
- [ember-template-lint: require-valid-alt-text](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/require-valid-alt-text.md)
