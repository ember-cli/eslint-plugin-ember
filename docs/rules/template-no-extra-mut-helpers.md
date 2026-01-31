# ember/template-no-extra-mut-helpers

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Disallows unnecessary `mut` helpers.

## Rule Details

The `mut` helper is often unnecessary when passing simple values or properties. It should only be used when explicitly creating a mutable reference is required.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <MyComponent @onChange={{mut this.value}} />
</template>
```

```gjs
<template>
  <Input @value={{mut this.text}} />
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <MyComponent @value={{this.value}} />
</template>
```

```gjs
<template>
  <Input @value={{this.text}} />
</template>
```

## References

- [ember-template-lint no-extra-mut-helper-argument](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-extra-mut-helper-argument.md)
