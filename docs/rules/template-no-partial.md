# ember/template-no-partial

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

- [eslint-plugin-ember template-no-partial](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-partial.md)
- [Ember.js Deprecations - Partials](https://deprecations.emberjs.com/v3.x/#toc_ember-partial)
