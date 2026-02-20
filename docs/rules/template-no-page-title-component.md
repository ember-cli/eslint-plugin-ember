# ember/template-no-page-title-component

<!-- end auto-generated rule header -->

Disallows usage of the `<PageTitle>` component.

## Rule Details

Use the `{{pageTitle}}` helper instead of the `<PageTitle>` component from ember-page-title.

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
  {{pageTitle "My Page"}}
</template>
```

```gjs
<template>
  {{pageTitle this.dynamicTitle}}
</template>
```

## References

- [ember-page-title documentation](https://github.com/ember-cli/ember-page-title)
