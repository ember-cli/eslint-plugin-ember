# ember/template-deprecated-render-helper

💼 This rule is enabled in the 📋 `template-lint-migration` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

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
