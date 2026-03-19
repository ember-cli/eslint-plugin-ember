# ember/template-splat-attributes-only

<!-- end auto-generated rule header -->

It is easy to introduce typos when typing out `...attributes` or to use e.g.
`...arguments` instead. Unfortunately, that leads to a cryptic runtime error,
but does not fail the build.

This rule warns you when you use an attribute starting with `...` that is **not**
`...attributes`.

## Examples

This rule **forbids** the following:

```gjs
<template><div ...atributes></div></template>
```

```gjs
<template><div ...arguments></div></template>
```

This rule **allows** the following:

```gjs
<template><div ...attributes></div></template>
```

## References

- [Ember 3.11 release](https://blog.emberjs.com/2019/07/15/ember-3-11-released.html)
