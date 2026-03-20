# ember/template-require-iframe-src-attribute

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Omitting the `src` attribute from an `<iframe>` element can silently bypass your Content Security Policy's `frame-src` directive.

When an `<iframe>` has no `src` (or an empty `src`), it implicitly loads `about:blank`. This document inherits the origin of the parent page, allowing the iframe to operate under the same-origin policy. Later dynamically setting `src` (e.g., via JavaScript) does not re-validate against `frame-src`, which exposes an **elevation-of-privilege vector**.

This rule ensures that all `<iframe>` elements specify a `src` attribute explicitly in the markup, even if it is a placeholder like `"about:blank"` or a safe data URL.

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
  <iframe src='/safe-path' {{this.setFrameElement}}></iframe>
</template>
```

```gjs
<template>
  <iframe src='data:text/html,<h1>safe</h1>'></iframe>
</template>
```

```gjs
<template>
  <iframe src=''></iframe>
</template>
```

## Migration

If you're dynamically setting the `src`, pre-populate the element with a secure initial `src` to ensure CSP applies:

```gjs
<template>
  <iframe src='about:blank' {{this.setFrameElement}}></iframe>
</template>
```

Or, if you know the eventual value ahead of time:

```gjs
<template>
  <iframe src='/iframe-entry' {{this.setFrameElement}}></iframe>
</template>
```

## Related Rules

- [require-iframe-title](template-require-iframe-title.md)

## References

- [CSP `frame-src` bypass via missing `src`](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-src)
- [MDN on `<iframe>` `src`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-src)
