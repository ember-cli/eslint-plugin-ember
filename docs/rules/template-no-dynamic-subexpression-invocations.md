# ember/template-no-dynamic-subexpression-invocations

<!-- end auto-generated rule header -->

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

Disallow dynamic helper invocations.

Dynamic helper invocations (where the helper name comes from a property or argument) make code harder to understand and can have performance implications. Use explicit helper names instead.

## Rule Details

This rule disallows invoking helpers dynamically using `this` or `@` properties.

## Examples

### Incorrect ❌

```gjs
<template>
  {{(this.helper "arg")}}
</template>
```

```gjs
<template>
  {{(@helperName "value")}}
</template>
```

```gjs
<template>
  {{this.formatter this.data}}
</template>
```

### Correct ✅

```gjs
<template>
  {{format-date this.date}}
</template>
```

```gjs
<template>
  {{(upper-case this.name)}}
</template>
```

```gjs
<template>
  {{this.formattedData}}
</template>
```

## Related Rules

- [template-no-implicit-this](./template-no-implicit-this.md)

## References

- [Ember Guides - Template Helpers](https://guides.emberjs.com/release/components/helper-functions/)
- [eslint-plugin-ember template-no-dynamic-subexpression-invocations](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-dynamic-subexpression-invocations.md)
