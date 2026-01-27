# ember/template-no-class-bindings

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Disallows usage of class attribute bindings.

## Rule Details

This rule discourages the use of class attribute bindings with colon syntax. Use the `{{class}}` helper or individual classes instead for better readability and maintainability.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div class={{isActive:active:inactive}}></div>
</template>
```

```gjs
<template>
  <div class={{foo:bar}}></div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div class={{if this.isActive "active" "inactive"}}></div>
</template>
```

```gjs
<template>
  <div class={{this.myClass}}></div>
</template>
```

## References

- [ember-template-lint no-class-bindings](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-class-bindings.md)
