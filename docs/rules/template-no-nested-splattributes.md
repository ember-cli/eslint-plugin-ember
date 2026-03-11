# ember/template-no-nested-splattributes

<!-- end auto-generated rule header -->

Disallow nested `...attributes` usage.

Having `...attributes` on multiple elements nested within each other in a component can cause unintended results. This rule prevents `...attributes` on an element if any of its parent elements already has `...attributes`.

## Rule Details

This rule disallows `...attributes` on an element when an ancestor element already has `...attributes`.

## Examples

### Incorrect ❌

```gjs
<template>
  <div ...attributes>
    <span ...attributes>Text</span>
  </div>
</template>
```

```gjs
<template>
  <section ...attributes>
    <div>
      <button ...attributes>Click</button>
    </div>
  </section>
</template>
```

### Correct ✅

```gjs
<template>
  <div ...attributes>Content</div>
</template>
```

```gjs
<template>
  <div ...attributes>
    <span>Text</span>
  </div>
</template>
```

```gjs
<template>
  <div ...attributes>first</div>
  <div ...attributes>second</div>
</template>
```

## Migration

- Remove the inner `...attributes` declaration

## References

- [Ember Guides - Splattributes](https://guides.emberjs.com/release/components/component-arguments-and-html-attributes/#toc_html-attributes)
- [eslint-plugin-ember template-no-nested-splattributes](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-nested-splattributes.md)
