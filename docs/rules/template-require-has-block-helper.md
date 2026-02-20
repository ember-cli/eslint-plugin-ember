# ember/template-require-has-block-helper

<!-- end auto-generated rule header -->

Requires usage of the `(has-block)` helper instead of the `hasBlock` property.

## Rule Details

The `(has-block)` helper is the preferred way to check if a block was provided to a component.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{#if hasBlock}}
    {{yield}}
  {{/if}}
</template>
```

```gjs
<template>
  {{#if this.hasBlock}}
    {{yield}}
  {{/if}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  {{#if (has-block)}}
    {{yield}}
  {{/if}}
</template>
```

```gjs
<template>
  {{#if (has-block "inverse")}}
    {{yield to="inverse"}}
  {{/if}}
</template>
```

## References

- [eslint-plugin-ember template-require-has-block-helper](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-require-has-block-helper.md)
