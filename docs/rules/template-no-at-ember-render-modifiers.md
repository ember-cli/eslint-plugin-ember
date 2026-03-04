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

## Migration

The migration path typically depends on what the render-modifier was used for, but if you need a custom modifier, the [`ember-modifier` README](https://github.com/ember-modifier/ember-modifier) covers everything you need to know for making custom modifiers.

For example, if render modifiers were used for setup/teardown, the migration to `ember-modifier` could be the following:

```js
import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';

export default class MyComponent extends Component {
  myModifier = modifier((element) => {
    let handleEvent = () => {};

    element.addEventListener('eventName', handleEvent);

    return () => element.removeEventListener('eventName', handelEvent);
  });
}
```

```hbs
<div {{this.myModifier}}>
```

## References

- [eslint-plugin-ember template-no-at-ember-render-modifiers](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-at-ember-render-modifiers.md)
