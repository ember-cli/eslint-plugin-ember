# ember/template-no-aria-unsupported-elements

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Disallows using ARIA roles, states, and properties on elements that do not support them.

Certain HTML elements do not support ARIA roles, states, and properties. This rule helps ensure that ARIA attributes are only used on elements that support them, improving accessibility.

## Rule Details

This rule disallows ARIA attributes on elements that do not support them, including:

- `meta`
- `html`
- `script`
- `style`
- `title`
- `base`
- `head`
- `link`

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <meta role="button" />
</template>
```

```gjs
<template>
  <script aria-label="Analytics"></script>
</template>
```

```gjs
<template>
  <style role="presentation"></style>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div role="button" aria-label="Submit"></div>
</template>
```

```gjs
<template>
  <button aria-pressed="true">Toggle</button>
</template>
```

## References

- [WAI-ARIA in HTML](https://www.w3.org/TR/html-aria/)
- [ember-template-lint no-aria-unsupported-elements](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-aria-unsupported-elements.md)
