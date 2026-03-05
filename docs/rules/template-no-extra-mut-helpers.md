# ember/template-no-extra-mut-helpers

<!-- end auto-generated rule header -->

> **HBS Only**: This rule applies to classic `.hbs` template files only (loose mode). It is not relevant for `gjs`/`gts` files (strict mode), where these patterns cannot occur.

Disallows unnecessary `mut` helpers.

## Rule Details

The `mut` helper is often unnecessary when passing simple values or properties. It should only be used when explicitly creating a mutable reference is required.

## Examples

Examples of **incorrect** code for this rule:

```hbs
<MyComponent @onChange={{mut this.value}} />
```

```hbs
<Input @value={{mut this.text}} />
```

Examples of **correct** code for this rule:

```hbs
<MyComponent @value={{this.value}} />
```

```hbs
<Input @value={{this.text}} />
```

## References

- [eslint-plugin-ember template-no-extra-mut-helper-argument](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-extra-mut-helper-argument.md)
