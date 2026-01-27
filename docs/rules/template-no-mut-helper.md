# ember/template-no-mut-helper

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

Disallow usage of the `(mut)` helper.

The `(mut)` helper was used in classic Ember to create two-way bindings. In modern Ember (Octane and beyond), this pattern is discouraged in favor of explicit one-way data flow with actions or setters.

## Rule Details

This rule disallows using the `(mut)` helper in templates.

## Examples

### Incorrect ❌

```gjs
<template>
  <Input @value={{this.name}} @onChange={{mut this.name}} />
</template>
```

```gjs
<template>
  {{input value=(mut this.name)}}
</template>
```

```gjs
<template>
  <CustomComponent @onChange={{mut this.value}} />
</template>
```

### Correct ✅

```gjs
<template>
  <Input @value={{this.name}} @onChange={{this.updateName}} />
</template>
```

```gjs
<template>
  <Input @value={{this.name}} @onChange={{fn (mut this "name")}} />
</template>
```

```gjs
<template>
  <CustomComponent @onChange={{this.handleChange}} />
</template>
```

## Related Rules

- [no-mut-helper](./no-mut-helper.md)

## References

- [Ember Octane Guide - Two-way bindings](https://guides.emberjs.com/release/upgrading/current-edition/)
- [ember-template-lint: no-mut-helper](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-mut-helper.md)
