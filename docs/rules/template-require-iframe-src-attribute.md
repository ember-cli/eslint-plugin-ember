# ember/template-require-iframe-src-attribute

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): ✅ `recommended`, `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Require iframe elements to have a src attribute.

For security reasons, iframe elements should always have a static `src` attribute. Without it, CSP `frame-src` is bypassed and the iframe inherits the parent origin, creating a security risk.

## Examples

This rule **forbids** the following:

```hbs
<template>
  <iframe></iframe>
</template>
```

```hbs
<template>
  <iframe {{this.setFrameElement}}></iframe>
</template>
```

This rule **allows** the following:

```hbs
<template>
  <iframe src='about:blank'></iframe>
</template>
```

```hbs
<template>
  <iframe src='/safe-path'></iframe>
</template>
```

```hbs
<template>
  <iframe src='data:text/html,<h1>safe</h1>'></iframe>
</template>
```

## Why?

When an iframe element doesn't have a `src` attribute, it defaults to `about:blank`. Without an explicit `src` attribute, the iframe inherits the origin of the parent document, creating a security vulnerability where scripts could potentially access the parent's context.

## References

- [MDN - iframe element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)
- [OWASP - Clickjacking Prevention](https://owasp.org/www-community/attacks/Clickjacking)
