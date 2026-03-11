# ember/template-no-abstract-roles

<!-- end auto-generated rule header -->

The HTML attribute `role` must never have the following values:

- `command`
- `composite`
- `input`
- `landmark`
- `range`
- `roletype`
- `section`
- `sectionhead`
- `select`
- `structure`
- `widget`
- `window`

## Examples

This rule **forbids** the following:

```gjs
<template><div role='window'> Hello, world! </div></template>
```

This rule **allows** the following:

```gjs
<template><div role='button'> Push it </div></template>
```

## References

- See [https://www.w3.org/TR/wai-aria-1.0/roles#abstract_roles](https://www.w3.org/TR/wai-aria-1.0/roles#abstract_roles)
