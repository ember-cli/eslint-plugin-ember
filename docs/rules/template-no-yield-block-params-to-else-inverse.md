# ember/template-no-yield-block-params-to-else-inverse

<!-- end auto-generated rule header -->

Yielding to else block is mainly useful for supporting curly invocation syntax. However, the else block in curly invocation syntax does not support consuming block params.

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
  {{yield to='else'}}
  {{yield to='inverse'}}
</template>
```

## Migration

We need to remove block params from highlighted yield's and update application logic to not consume it.

In addition, we could use named blocks (slots) to provide values.

## References

- [Ember Guides – Block content](https://guides.emberjs.com/v5.5.0/components/block-content/)

## Related Rules

- [no-yield-only](template-no-yield-only.md)
- [no-yield-to-default](template-no-yield-to-default.md)
