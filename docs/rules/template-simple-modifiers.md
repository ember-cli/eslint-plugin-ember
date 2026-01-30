# ember/template-simple-modifiers

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): ✅ `recommended`, `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Require simple modifier syntax.

The `modifier` helper should have a simple string or path expression as its first argument (the modifier name). Complex expressions should not be used as the first argument.

## Examples

This rule **forbids** the following:

```hbs
<template>
  <div {{(modifier (unless this.condition 'simple-modifier'))}}></div>
</template>
```

```hbs
<template>
  <div {{(modifier)}}></div>
</template>
```

This rule **allows** the following:

```hbs
<template>
  <div {{(modifier 'track-interaction' @data)}}></div>
</template>
```

```hbs
<template>
  <div {{(modifier this.modifierName)}}></div>
</template>
```

## Why?

Using complex expressions as the modifier name reduces readability and makes it harder to understand which modifier is being applied.

## References

- [Ember.js Guides - Modifiers](https://guides.emberjs.com/release/components/template-lifecycle-dom-and-modifiers/)
