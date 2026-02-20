# ember/template-no-yield-to-default

<!-- end auto-generated rule header -->

Disallows yielding to the "default" block explicitly.

## Rule Details

Using `{{yield to="default"}}` is unnecessary. Simply use `{{yield}}` instead.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{yield to="default"}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  {{yield}}
</template>
```

```gjs
<template>
  {{yield to="inverse"}}
</template>
```

## References

- [eslint-plugin-ember template-no-yield-to-default](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-yield-to-default.md)
