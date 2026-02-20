# ember/template-no-only-default-slot

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallows using only the `default` slot when rendering content into a component.

The default slot (`<:default>`) is used to explicitly target the main content block of a component. However, when _only_ the default slot is used — with no named slots — the extra syntax is redundant and unnecessary.

This rule disallows using only the `default` slot block when rendering content into a component. The preferred form is to pass the content directly, without the default slot wrapper.

## Motivation

When a component has a single default block like this:

```hbs
<MyComponent>
  <:default>
    Hello!
  </:default>
</MyComponent>
```

The `<:default>` adds no semantic value. It's simpler and clearer to write:

```hbs
<MyComponent>
  Hello!
</MyComponent>
```

Explicit slot naming should only be used when multiple slots are present, and disambiguation is needed.

## Examples

This rule **forbids** the following:

```hbs
<MyComponent>
  <:default>
    What?
  </:default>
</MyComponent>
```

```hbs
<MyComponent>
  <:default>
    <p>Hello world</p>
  </:default>
</MyComponent>
```

This rule **allows** the following:

```hbs
<MyComponent>
  Hello!
</MyComponent>
```

```hbs
<MyComponent>
  <:header>Header</:header>
  <:default>Content</:default>
</MyComponent>
```

## References

- [Ember Guides - Named Blocks](https://guides.emberjs.com/release/components/block-content/#toc_named-blocks)
