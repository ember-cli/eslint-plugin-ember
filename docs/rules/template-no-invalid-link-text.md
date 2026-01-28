# ember/template-no-invalid-link-text

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Disallows invalid or uninformative link text content.

Link text should be descriptive and provide context about the destination. Generic phrases like "click here" or "read more" are not accessible because they don't convey meaningful information, especially for screen reader users who may navigate by links alone.

## Rule Details

This rule disallows the following link text values:
- "click here"
- "here"
- "link"
- "read more"
- "more"
- "click"
- "this"
- "read"

Links with `aria-label` or `aria-labelledby` attributes are exempt, as they provide alternative accessible names.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <a href="/about">Click here</a>
</template>
```

```gjs
<template>
  <a href="/docs">Read more</a>
</template>
```

```gjs
<template>
  <LinkTo @route="contact">Here</LinkTo>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <a href="/about">About Us</a>
</template>
```

```gjs
<template>
  <a href="/docs">Documentation</a>
</template>
```

```gjs
<template>
  <a href="/page" aria-label="View user profile">Click here</a>
</template>
```

## References

- [WebAIM: Link Text and Appearance](https://webaim.org/techniques/hypertext/link_text)
- [WCAG 2.4.4: Link Purpose (In Context)](https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html)
- [ember-template-lint no-invalid-link-text](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-invalid-link-text.md)
