# ember/template-deprecated-render-helper

> **HBS Only**: This rule applies to classic `.hbs` template files only (loose mode). It is not relevant for `gjs`/`gts` files (strict mode), where these patterns cannot occur.

<!-- end auto-generated rule header -->

Disallows the {{render}} helper which is deprecated.

## Examples

Incorrect:

```hbs
{{render 'user'}}
```

Correct:

```hbs
<User />
```

## References

- [eslint-plugin-ember template-deprecated-render-helper](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-deprecated-render-helper.md)
