# ember/template-no-yield-only

💼 This rule is enabled in the 📋 `template-lint-migration` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Templates that only contain a single `{{yield}}` instruction are not required
and increase the total template payload size.

This rule warns about templates that only contain a single `{{yield}}`
instruction.

## Examples

This rule **forbids** the following:

```gjs
<template>
  {{yield}}
</template>
```

```gjs
<template>

   {{yield}}

</template>
```

This rule **allows** the following:

```gjs
<template>
  {{yield something}}
</template>
```

```gjs
<template>
  <div>{{yield}}</div>
</template>
```

## Migration

- delete all files that are flagged by this rule

## References

- <https://github.com/ember-template-lint/ember-template-lint/issues/29>
