# ember/template-no-at-ember-render-modifiers

<!-- end auto-generated rule header -->

Disallows usage of modifiers from @ember/render-modifiers.

## Rule Details

The modifiers from `@ember/render-modifiers` (`{{did-insert}}`, `{{did-update}}`, `{{will-destroy}}`) should be replaced with alternatives from `ember-render-helpers` or other modern approaches.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div {{did-insert this.setup}}></div>
</template>
```

```gjs
<template>
  <div {{did-update this.update}}></div>
</template>
```

```gjs
<template>
  <div {{will-destroy this.cleanup}}></div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div {{on "click" this.handleClick}}></div>
</template>
```

## References

- [eslint-plugin-ember template-no-at-ember-render-modifiers](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-at-ember-render-modifiers.md)
