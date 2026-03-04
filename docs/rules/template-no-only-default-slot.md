# ember/template-no-only-default-slot

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallows using only the `default` slot when rendering content into a component.

The default slot (`<:default>`) is used to explicitly target the main content block of a component. However, when _only_ the default slot is used — with no named slots — the extra syntax is redundant and unnecessary.

This rule disallows using only the `default` slot block when rendering content into a component. The preferred form is to pass the content directly, without the default slot wrapper.

## Motivation

When a component has a single default block like this:

```gjs
<template>
  <MyComponent>
    <:default>
      Hello!
    </:default>
  </MyComponent>
</template>
```

The `<:default>` adds no semantic value. It's simpler and clearer to write:

```gjs
<template>
  <MyComponent>
    Hello!
  </MyComponent>
</template>
```

Explicit slot naming should only be used when multiple slots are present, and disambiguation is needed.

## Examples

This rule **forbids** the following:

```gjs
<template>
  <MyComponent>
    <:default>
      What?
    </:default>
  </MyComponent>
</template>
```

```gjs
<template>
  <MyComponent>
    <:default>
      <p>Hello world</p>
    </:default>
  </MyComponent>
</template>
```

This rule **allows** the following:

```gjs
<template>
  <MyComponent>
    Hello!
  </MyComponent>
</template>
```

```gjs
<template>
  <MyComponent>
    <:header>Header</:header>
    <:default>Content</:default>
  </MyComponent>
</template>
```

## Migration

If you see this pattern:

```hbs
<SomeCard>
  <:default>
    Card Content
  </:default>
</SomeCard>
```

Just remove the `<:default>` wrapper:

```hbs
<SomeCard>
  Card Content
</SomeCard>
```

## References

- [Ember Guides - Named Blocks](https://guides.emberjs.com/release/components/block-content/#toc_named-blocks)
