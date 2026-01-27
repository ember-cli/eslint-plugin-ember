# ember/template-no-page-title-component

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Disallows usage of the `<PageTitle>` component.

## Rule Details

Use the `{{page-title}}` helper instead of the `<PageTitle>` component from ember-page-title.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <PageTitle>My Page</PageTitle>
</template>
```

```gjs
<template>
  <PageTitle @title="My Page" />
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  {{page-title "My Page"}}
</template>
```

```gjs
<template>
  {{page-title this.dynamicTitle}}
</template>
```

## References

- [ember-page-title documentation](https://github.com/ember-cli/ember-page-title)
