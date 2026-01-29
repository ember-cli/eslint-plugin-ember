# ember/template-no-nested-splattributes

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

Disallow nested `...attributes` usage.

The `...attributes` syntax is used to pass HTML attributes to components. It should only be used on the top-level element of a component template, not on nested elements. Using it on nested elements can lead to unexpected behavior and makes it unclear which element receives the attributes.

## Rule Details

This rule disallows using `...attributes` on nested elements within a template.

## Examples

### Incorrect ❌

```gjs
<template>
  <div>
    <span ...attributes>Text</span>
  </div>
</template>
```

```gjs
<template>
  <section>
    <div>
      <button ...attributes>Click</button>
    </div>
  </section>
</template>
```

```gjs
<template>
  <div class="wrapper">
    <input ...attributes />
  </div>
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
  <button ...attributes>Click</button>
</template>
```

```gjs
<template>
  <MyComponent ...attributes />
</template>
```

## References

- [Ember Guides - Splattributes](https://guides.emberjs.com/release/components/component-arguments-and-html-attributes/#toc_html-attributes)
- [ember-template-lint: no-nested-splattributes](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-nested-splattributes.md)
