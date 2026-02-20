# ember/template-no-yield-block-params-to-else-inverse

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Disallow yielding block params to else or inverse blocks.

Yielding block params (positional arguments) to `else` or `inverse` blocks doesn't work as expected. The params are not available in the inverse block.

## Examples

This rule **forbids** the following:

```hbs
<template>
  {{yield 'some' 'param' to='else'}}
</template>
```

```hbs
<template>
  {{yield 'some' 'param' to='inverse'}}
</template>
```

This rule **allows** the following:

```hbs
<template>
  {{yield}}
</template>
```

```hbs
<template>
  {{yield 'some' 'param'}}
</template>
```

```hbs
<template>
  {{yield to='inverse'}}
</template>
```

## References

- [Ember.js Guides - Yielding](https://guides.emberjs.com/release/components/component-arguments-and-html-attributes/#toc_yielding-content)
