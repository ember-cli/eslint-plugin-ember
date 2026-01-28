# ember/template-no-yield-only

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

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

- [ember-template-lint no-yield-only](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-yield-only.md)
