# ember/template-no-class-bindings

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

- [eslint-plugin-ember no-class-bindings](https://github.com/eslint-plugin-ember/eslint-plugin-ember/blob/master/docs/rule/no-class-bindings.md)
