# ember/template-no-yield-block-params-to-else-inverse

<!-- end auto-generated rule header -->

Disallow yielding block params to else or inverse blocks.

Yielding block params (positional arguments) to `else` or `inverse` blocks doesn't work as expected. The params are not available in the inverse block.

## Examples

This rule **forbids** the following:

```gjs
<template>
  {{yield 'some' 'param' to='else'}}
</template>
```

```gjs
<template>
  {{yield 'some' 'param' to='inverse'}}
</template>
```

This rule **allows** the following:

```gjs
<template>
  {{yield}}
</template>
```

```gjs
<template>
  {{yield 'some' 'param'}}
</template>
```

```gjs
<template>
  {{yield to='inverse'}}
</template>
```

## Migration

We need to remove block params from highlighted yield's and update application logic to not consume it.

In addition, we could use named blocks (slots) to provide values.

## Related Rules

- [no-yield-only](template-no-yield-only.md)
- [no-yield-to-default](template-no-yield-to-default.md)

## References

- [Ember.js Guides - Yielding](https://guides.emberjs.com/release/components/component-arguments-and-html-attributes/#toc_yielding-content)
