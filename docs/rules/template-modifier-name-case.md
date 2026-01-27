# ember/template-modifier-name-case

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Requires dasherized names for modifiers.

Modifiers should use dasherized names when being invoked, not camelCase. This is a stylistic rule that will prevent you from using camelCase modifiers, requiring you to use dasherized modifier names instead.

## Examples

This rule **forbids** the following:

```gjs
<template><div {{didInsert}}></div></template>
```

```gjs
<template><div {{onFocus}}></div></template>
```

```gjs
<template><div {{modifier 'didInsert'}}></div></template>
```

This rule **allows** the following:

```gjs
<template><div {{did-insert}}></div></template>
```

```gjs
<template><div {{on-focus}}></div></template>
```

```gjs
<template><div {{modifier 'did-insert'}}></div></template>
```

## See Also

- [named-functions-in-promises](named-functions-in-promises.md)

## References

- [Template syntax guide - Modifiers](https://guides.emberjs.com/release/components/template-syntax/#toc_modifiers)
