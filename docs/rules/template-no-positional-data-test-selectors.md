# ember/template-no-positional-data-test-selectors

<!-- end auto-generated rule header -->

Disallows positional data-test selectors.

## Rule Details

Data-test selectors should use descriptive names rather than positional indices for better maintainability and clarity.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div data-test-item="0"></div>
</template>
```

```gjs
<template>
  <div data-test-card="1"></div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div data-test-user-card></div>
</template>
```

```gjs
<template>
  <div data-test-item="my-item"></div>
</template>
```

## References

- [eslint-plugin-ember template-no-positional-data-test-selectors](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-positional-data-test-selectors.md)
