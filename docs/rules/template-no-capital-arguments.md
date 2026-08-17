# ember/template-no-capital-arguments

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): ✅ `recommended`, ![gjs logo](/docs/svgs/gjs.svg) `recommended-gjs`, ![gts logo](/docs/svgs/gts.svg) `recommended-gts`, 📋 `template-lint-migration`.

<!-- end auto-generated rule header -->

Disallow capital letters in argument names. Use lowercase argument names (e.g., `@arg` instead of `@Arg`).

## Rule Details

This rule enforces the convention that argument names should start with lowercase letters.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div>{{@Arg}}</div>
</template>
```

```gjs
<template>
  <div>{{@MyArgument}}</div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div>{{@arg}}</div>
</template>
```

```gjs
<template>
  <div>{{@myArgument}}</div>
</template>
```

## References

- [Ember Style Guide](https://github.com/ember-cli/ember-styleguide)
