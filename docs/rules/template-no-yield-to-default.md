# ember/template-no-yield-to-default

💼 This rule is enabled in the 📋 `template-lint-migration` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

The `yield` keyword can be used for invoking blocks passed into a component. The `to` named argument specifies which of the blocks to yield too. Specifying `{{yield to="default"}}` is unnecessary, as that is the default behavior. Likewise, `{{has-block}}` and `{{has-block-params}}` also defaults to checking the "default" block.

This rule disallow yield to named blocks with the name "default".

## Examples

This rule **forbids** the following:

```gjs
<template>
  {{yield to="default"}}
</template>
```

```gjs
<template>
  {{has-block "default"}}
</template>
```

```gjs
<template>
  {{has-block-params "default"}}
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
  {{has-block}}
</template>
```

```gjs
<template>
  {{has-block-params}}
</template>
```

## References
