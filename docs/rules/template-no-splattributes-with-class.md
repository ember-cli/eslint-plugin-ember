# ember/template-no-splattributes-with-class

<!-- end auto-generated rule header -->

Disallow using `...attributes` with `class` attribute.

When using `...attributes` (splattributes), any classes passed from the parent component will be automatically merged with the component's own classes. Adding a `class` attribute alongside `...attributes` can lead to confusion about which classes take precedence.

## Examples

This rule **forbids** the following:

```gjs
<template>
  <div ...attributes class='foo'>
    content
  </div>
</template>
```

```gjs
<template>
  <div class='foo' ...attributes>
    content
  </div>
</template>
```

This rule **allows** the following:

```gjs
<template>
  <div ...attributes>
    content
  </div>
</template>
```

```gjs
<template>
  <div class='foo'>
    content
  </div>
</template>
```

## Why?

When using `...attributes`, classes are automatically merged from parent components. Using a `class` attribute alongside it creates confusion about which classes take precedence and can lead to unexpected styling behavior.

## References

- [Ember.js Guides - Splattributes](https://guides.emberjs.com/release/components/component-arguments-and-html-attributes/#toc_html-attributes)
