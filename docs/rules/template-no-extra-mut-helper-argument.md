# ember/template-no-extra-mut-helper-argument

💼🚫 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations). This rule is _disabled_ in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): ![gjs logo](/docs/svgs/gjs.svg) `recommended-gjs`, ![gts logo](/docs/svgs/gts.svg) `recommended-gts`.

<!-- end auto-generated rule header -->

> **HBS Only**: This rule applies to classic `.hbs` template files only (loose mode). It is not relevant for `gjs`/`gts` files (strict mode), where these patterns cannot occur.

Disallows passing more than one argument to the `mut` helper.

A common mistake when using the Ember handlebars template `mut(attr)` helper is to pass an extra `value` parameter to it when only `attr` should be passed. Instead, the `value` should be passed outside of `mut`.

## Examples

This rule **forbids** the following:

```hbs
{{my-component click=(action (mut isClicked true))}}
```

This rule **allows** the following:

```hbs
{{my-component click=(action (mut isClicked) true)}}
```

## Related Rules

- [template-no-mut-helper](template-no-mut-helper.md)

## References

- See the [documentation](https://emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/mut?anchor=mut) for the Ember handlebars template `mut` helper
