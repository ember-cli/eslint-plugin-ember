# ember/template-no-input-placeholder

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Disallows `placeholder` attribute on input elements.

## Rule Details

The `placeholder` attribute should not be used as it has accessibility issues. Use proper labels instead.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <input placeholder="Enter username" />
</template>
```

```gjs
<template>
  <input type="text" placeholder="Username" />
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <label>
    Username
    <input type="text" />
  </label>
</template>
```

```gjs
<template>
  <input type="text" aria-label="Username" />
</template>
```

## References

- [ember-template-lint no-input-placeholder](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-input-placeholder.md)
- [Placeholders in Form Fields Are Harmful](https://www.nngroup.com/articles/form-design-placeholders/)
