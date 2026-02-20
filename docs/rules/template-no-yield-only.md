# ember/template-no-yield-only

<!-- end auto-generated rule header -->

Disallows components that only yield without any wrapper or additional functionality.

## Rule Details

Components should provide some structure or functionality beyond just yielding. If a component only yields, it adds unnecessary indirection.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{yield}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div class="wrapper">
    {{yield}}
  </div>
</template>
```

```gjs
<template>
  {{this.setup}}
  {{yield}}
</template>
```

## References

- [eslint-plugin-ember template-no-yield-only](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-yield-only.md)
