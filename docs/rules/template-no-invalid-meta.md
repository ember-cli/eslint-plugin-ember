# ember/template-no-invalid-meta

<!-- end auto-generated rule header -->

Disallow invalid meta tags.

Meta tags must be well-formed and follow accessibility/usability best practices.

## Rule Details

This rule checks `<meta>` elements for the following issues:

1. **Invalid charset** — `charset` must be `utf-8` (case-insensitive).
2. **Missing `content`** — If `name`, `property`, `itemprop`, or `http-equiv` is present, a `content` attribute is required.
3. **Missing identifier** — If `content` is present, one of `name`, `property`, `itemprop`, `http-equiv`, or `charset` must also be present.
4. **`http-equiv="refresh"` redirect delay** — A meta refresh that redirects (contains `;`) must have a delay of `0`.
5. **`http-equiv="refresh"` plain delay** — A meta refresh without a redirect must have a delay greater than 72000 seconds.
6. **Viewport `user-scalable=no`** — Disabling user scaling harms accessibility.
7. **Viewport `maximum-scale`** — Setting a maximum scale restricts zooming.

## Examples

### Incorrect

```gjs
<template>
  <meta charset="iso-8859-1" />
</template>
```

```gjs
<template>
  <meta name="description" />
</template>
```

Missing `content` when `name` is present.

```gjs
<template>
  <meta content="some value" />
</template>
```

Missing identifier (`name`, `property`, `itemprop`, or `http-equiv`) when `content` is present.

```gjs
<template>
  <meta http-equiv="refresh" content="5;url=https://example.com" />
</template>
```

Redirect delay must be 0.

```gjs
<template>
  <meta http-equiv="refresh" content="30" />
</template>
```

Plain refresh delay must be greater than 72000.

```gjs
<template>
  <meta name="viewport" content="width=device-width, user-scalable=no" />
</template>
```

```gjs
<template>
  <meta name="viewport" content="width=device-width, maximum-scale=1" />
</template>
```

### Correct

```gjs
<template>
  <meta charset="utf-8" />
</template>
```

```gjs
<template>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</template>
```

```gjs
<template>
  <meta name="description" content="A description of the page" />
</template>
```

```gjs
<template>
  <meta http-equiv="refresh" content="0;url=https://example.com" />
</template>
```

## References

- [MDN - Meta charset](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-charset)
- [WCAG - Meta Refresh](https://www.w3.org/TR/WCAG21/Understanding/timing-adjustable.html)
