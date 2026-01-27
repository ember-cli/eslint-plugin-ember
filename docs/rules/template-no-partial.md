# ember/template-no-partial

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): ![gjs logo](/docs/svgs/gjs.svg) `recommended-gjs`, ![gts logo](/docs/svgs/gts.svg) `recommended-gts`.

<!-- end auto-generated rule header -->

Disallows the use of `{{partial}}` helper.

Partials are deprecated in Ember.js and should be replaced with components for better maintainability and performance.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{partial "user-info"}}
</template>
```

```gjs
<template>
  <div>
    {{partial "header"}}
  </div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <UserInfo />
</template>
```

```gjs
<template>
  <div>
    <Header />
  </div>
</template>
```

## Migration

Replace partials with regular components for better composition and reusability.

## References

- [ember-template-lint no-partial](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-partial.md)
- [Ember.js Deprecations - Partials](https://deprecations.emberjs.com/v3.x/#toc_ember-partial)
