# ember/template-no-chained-this

<!-- end auto-generated rule header -->

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

Disallow chained property access on `this`.

Accessing deeply nested properties through `this` (like `this.user.name`) in templates makes components harder to refactor and test. It also creates tight coupling between the template and the component's internal structure. Use local variables or computed properties instead.

## Rule Details

This rule disallows chaining property access on `this` in templates (e.g., `this.foo.bar`).

## Examples

### Incorrect ❌

```gjs
<template>
  {{this.user.name}}
</template>
```

```gjs
<template>
  {{this.model.user.firstName}}
</template>
```

```gjs
<template>
  <div>{{this.data.items.length}}</div>
</template>
```

### Correct ✅

```gjs
<template>
  {{this.userName}}
</template>
```

```gjs
<template>
  {{get this.user "name"}}
</template>
```

```gjs
<template>
  {{userName}}
</template>
```

## Related Rules

- [template-no-implicit-this](./template-no-implicit-this.md)

## References

- [Ember Best Practices - Component Design](https://guides.emberjs.com/release/components/)
- [eslint-plugin-ember template-no-this-in-template-only-components](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-this-in-template-only-components.md)
