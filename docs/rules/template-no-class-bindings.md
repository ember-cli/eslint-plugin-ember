# ember/template-no-class-bindings

<!-- end auto-generated rule header -->

Disallow passing `classBinding` or `classNameBindings` as arguments within templates. These are legacy Ember Classic patterns that should be replaced with modern approaches.

## Examples

This rule **forbids** the following:

```gjs
<template><SomeThing @classBinding="isActive:active" /></template>
```

```gjs
<template>{{some-thing classNameBindings="isActive:active:inactive"}}</template>
```

```gjs
<template><SomeThing @classNameBindings="isActive:active:inactive" /></template>
```

This rule **allows** the following:

```gjs
<template><SomeThing class={{if this.isActive "active"}} /></template>
```

```gjs
<template><SomeThing /></template>
```

## Migration

- find in templates and remove `classBinding` and/or `classNameBindings`.

## References

- [ember-template-lint no-class-bindings](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-class-bindings.md)
