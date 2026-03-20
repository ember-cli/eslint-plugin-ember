# ember/template-require-has-block-helper

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

In Ember 3.26 the properties `hasBlock` and `hasBlockParams` were deprecated. Their replacement is to use `has-block` and `has-block-params` helpers instead.

This rule prevents the usage of `hasBlock` and `hasBlockParams` and suggests using `has-block` or `has-block-params` instead.

For more information about this deprecation you can view the [RFC](https://github.com/emberjs/rfcs/blob/master/text/0689-deprecate-has-block.md) or its entry on the [Deprecations page](https://deprecations.emberjs.com/v3.x/#toc_has-block-and-has-block-params).

## Examples

This rule **forbids** the following:

```gjs
<template>
  {{hasBlock}}
  {{#if hasBlock}}

  {{/if}}
</template>
```

```gjs
<template>
  {{hasBlockParams}}
  {{#if hasBlockParams}}

  {{/if}}
</template>
```

This rule **allows** the following:

```gjs
<template>
  {{has-block}}
  {{#if (has-block)}}

  {{/if}}
</template>
```

```gjs
<template>
  {{has-block-params}}
  {{#if (has-block-params)}}

  {{/if}}
</template>
```

## Migration

- `{{hasBlock}}` -> `{{has-block}}`
- `{{hasBlockParams}}` -> `{{has-block-params}}`
- `{{#if hasBlock}} {{/if}}` -> `{{#if (has-block)}} {{/if}}`
- `{{#if (hasBlock "inverse")}} {{/if}}` -> `{{#if (has-block "inverse")}} {{/if}}`
- `{{#if hasBlockParams}} {{/if}}` -> `{{#if (has-block-params)}} {{/if}}`
- `{{#if (hasBlockParams "inverse")}} {{/if}}` -> `{{#if (has-block-params "inverse")}} {{/if}}`

## References

- [RFC](https://github.com/emberjs/rfcs/blob/master/text/0689-deprecate-has-block.md)
- [Deprecation information](https://deprecations.emberjs.com/v3.x/#toc_has-block-and-has-block-params)
