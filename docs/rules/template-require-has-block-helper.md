# ember/template-require-has-block-helper

> **HBS Only**: This rule applies to classic `.hbs` template files only (loose mode). It is not relevant for `gjs`/`gts` files (strict mode), where these patterns cannot occur.

<!-- end auto-generated rule header -->

Requires usage of the `(has-block)` helper instead of the `hasBlock` property.

## Rule Details

The `(has-block)` helper is the preferred way to check if a block was provided to a component.

## Examples

Examples of **incorrect** code for this rule:

```hbs
{{#if hasBlock}}
  {{yield}}
{{/if}}
```

```hbs
{{#if this.hasBlock}}
  {{yield}}
{{/if}}
```

Examples of **correct** code for this rule:

```hbs
{{#if (has-block)}}
  {{yield}}
{{/if}}
```

```hbs
{{#if (has-block 'inverse')}}
  {{yield to='inverse'}}
{{/if}}
```

## Migration

- `{{hasBlock}}`-> `{{has-block}}
- `{{hasBlockParams}}`-> `{{has-block-params}}
- `{{#if hasBlock}} {{/if}}`-> `{{#if (has-block)}} {{/if}}`
- `{{#if (hasBlock "inverse")}} {{/if}}`-> `{{#if (has-block "inverse")}} {{/if}}`
- `{{#if hasBlockParams}} {{/if}}`-> `{{#if (has-block-params)}} {{/if}}`
- `{{#if (hasBlockParams "inverse")}} {{/if}}`-> `{{#if (has-block-params "inverse")}} {{/if}}`

## References

- [eslint-plugin-ember template-require-has-block-helper](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-require-has-block-helper.md)
