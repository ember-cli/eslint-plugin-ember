# ember/template-no-unused-block-params

💼 This rule is enabled in the 📋 `template-lint-migration` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

This rule forbids unused block parameters except when they are needed to access a later parameter.

## Examples

This rule **forbids** the following (unused parameters):

```gjs
<template>
  {{#each users as |user index|}}
    {{user.name}}
  {{/each}}
</template>
```

This rule **allows** the following:

Allowed (used parameters):

```gjs
<template>
  {{#each users as |user|}}
    {{user.name}}
  {{/each}}
</template>
```

```gjs
<template>
  {{#each users as |user index|}}
    {{index}} {{user.name}}
  {{/each}}
</template>
```

Allowed (later parameter used):

```gjs
<template>
  {{#each users as |user index|}}
    {{index}}
  {{/each}}
</template>
```

## Related rules

- [eslint/no-unused-vars](https://eslint.org/docs/rules/no-unused-vars)

## References

- [Ember guides/block content](https://guides.emberjs.com/release/components/block-content/)
- [rfcs/angle bracket invocation](https://emberjs.github.io/rfcs/0311-angle-bracket-invocation.html)
- [rfcs/named blocks](https://emberjs.github.io/rfcs/0226-named-blocks.html)
