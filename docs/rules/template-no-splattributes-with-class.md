# ember/template-no-splattributes-with-class

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Disallow using `...attributes` with `class` attribute.

When using `...attributes` (splattributes), any classes passed from the parent component will be automatically merged with the component's own classes. Adding a `class` attribute alongside `...attributes` can lead to confusion about which classes take precedence.

## Examples

This rule **forbids** the following:

```hbs
<div ...attributes class='foo'>
  content
</div>
```

```hbs
<div class='foo' ...attributes>
  content
</div>
```

This rule **allows** the following:

```hbs
<div ...attributes>
  content
</div>
```

```hbs
<div class='foo'>
  content
</div>
```

## Why?

When using `...attributes`, classes are automatically merged from parent components. Using a `class` attribute alongside it creates confusion about which classes take precedence and can lead to unexpected styling behavior.

## References

- [Ember.js Guides - Splattributes](https://guides.emberjs.com/release/components/component-arguments-and-html-attributes/#toc_html-attributes)
