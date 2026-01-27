# ember/template-no-array-prototype-extensions

<!-- end auto-generated rule header -->

Disallow usage of Ember Array prototype extensions.

Ember historically provided Array prototype extensions like `firstObject` and `lastObject`. These extensions are deprecated and should be replaced with native JavaScript array methods or computed properties.

## Rule Details

This rule disallows using Ember Array prototype extensions in templates:

- `firstObject`
- `lastObject`
- `@each`
- `[]`

## Examples

### Incorrect ❌

```gjs
<template>
  {{this.items.firstObject}}
</template>
```

```gjs
<template>
  {{this.users.lastObject}}
</template>
```

```gjs
<template>
  {{this.data.@each}}
</template>
```

### Correct ✅

```gjs
<template>
  {{get this.items 0}}
</template>
```

```gjs
<template>
  {{this.firstItem}}
</template>
```

```gjs
<template>
  {{#each this.items as |item|}}
    {{item}}
  {{/each}}
</template>
```

## Related Rules

- [no-array-prototype-extensions](./no-array-prototype-extensions.md)

## References

- [Ember Deprecations - Array prototype extensions](https://deprecations.emberjs.com/v3.x/#toc_ember-array-prototype-extensions)
- [eslint-plugin-ember template-no-array-prototype-extensions](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-array-prototype-extensions.md)
