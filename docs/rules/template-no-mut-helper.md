# ember/template-no-mut-helper

> **HBS Only**: This rule applies to classic `.hbs` template files only (loose mode). It is not relevant for `gjs`/`gts` files (strict mode), where these patterns cannot occur.

<!-- end auto-generated rule header -->

Disallows use of the `mut` helper.

The `mut` helper is a legacy pattern for two-way binding. In modern Ember, use JS actions or the `set` helper instead.

## Rule Details

This rule disallows any use of `mut`, both as a mustache (`{{mut x}}`) and as a sub-expression (`(mut x)`).

## Options

```json
["error", { "setterAlternative": "`{{set}}`" }]
```

## Examples

Examples of **incorrect** code for this rule:

```hbs
<MyComponent @toggled={{mut this.showAggregatedLine}} />
```

```hbs
{{my-component value=(mut this.value)}}
```

```hbs
<MyComponent @onVisibilityChange={{fn (mut this.isDropdownOpen)}} />
```

Examples of **correct** code for this rule:

```hbs
<MyComponent @toggled={{this.showAggregatedLine}} />
```

```hbs
<MyComponent @toggle={{set this 'isDropdownOpen'}} />
```

## References

- [ember-template-lint no-mut-helper](https://github.com/ember-template-lint/ember-template-lint/blob/main/docs/rule/no-mut-helper.md)
