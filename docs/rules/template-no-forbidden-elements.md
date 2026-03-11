# ember/template-no-forbidden-elements

<!-- end auto-generated rule header -->

This rule disallows the use of forbidden elements in template files.

The rule is configurable so teams can add their own disallowed elements.
The default list of forbidden elements are `meta`, `style`, `html`, and `script`.

## Examples

This rule **forbids** the following:

```gjs
<template><script></script></template>
```

```gjs
<template><style></style></template>
```

```gjs
<template><html></html></template>
```

```gjs
<template><meta charset='utf-8' /></template>
```

This rule **allows** the following:

```gjs
<template><header></header></template>
```

```gjs
<template><div></div></template>
```

```gjs
<template>
  <head>
    <meta charset='utf-8' />
  </head>
</template>
```

Note: `<meta>` inside `<head>` is allowed as an exception.

## Configuration

- `boolean` — `true` to enable with defaults / `false` to disable
- `string[]` — an array of element names to forbid (default: `['meta', 'style', 'html', 'script']`)

## References

- [Ember guides/template restrictions](https://guides.emberjs.com/release/components/#toc_restrictions)
