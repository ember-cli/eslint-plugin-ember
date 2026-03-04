# ember/template-require-iframe-src-attribute

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Require iframe elements to have a src attribute.

For security reasons, iframe elements should always have a static `src` attribute. Without it, CSP `frame-src` is bypassed and the iframe inherits the parent origin, creating a security risk.

## 🚨 Why this matters

An attacker could inject a seemingly harmless `<iframe>` into your template, then programmatically change its `src`. Without a defined `src` at load time, the browser grants it origin privileges that persist **after the `src` is changed**, effectively sidestepping CSP.

## Examples

This rule **forbids** the following:

```gjs
<template>
  <iframe></iframe>
</template>
```

```gjs
<template>
  <iframe {{this.setFrameElement}}></iframe>
</template>
```

This rule **allows** the following:

```gjs
<template>
  <iframe src='about:blank'></iframe>
</template>
```

```gjs
<template>
  <iframe src='/safe-path'></iframe>
</template>
```

```gjs
<template>
  <iframe src='data:text/html,<h1>safe</h1>'></iframe>
</template>
```

## Why?

When an iframe element doesn't have a `src` attribute, it defaults to `about:blank`. Without an explicit `src` attribute, the iframe inherits the origin of the parent document, creating a security vulnerability where scripts could potentially access the parent's context.

## Migration

If you're dynamically setting the `src`, pre-populate the element with a secure initial `src` to ensure CSP applies:

```hbs
<iframe src="about:blank" {{this.setFrameElement}}></iframe>
```

Or, if you know the eventual value ahead of time:

```hbs
<iframe src="/iframe-entry" {{this.setFrameElement}}></iframe>
```

## Related Rules

- [require-iframe-title](template-require-iframe-title.md)

## References

- [MDN - iframe element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)
- [OWASP - Clickjacking Prevention](https://owasp.org/www-community/attacks/Clickjacking)
