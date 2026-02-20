# ember/template-no-extra-mut-helpers

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

- [eslint-plugin-ember template-no-extra-mut-helper-argument](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-extra-mut-helper-argument.md)
