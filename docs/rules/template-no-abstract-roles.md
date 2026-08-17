# ember/template-no-abstract-roles

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): ✅ `recommended`, ![gjs logo](/docs/svgs/gjs.svg) `recommended-gjs`, ![gts logo](/docs/svgs/gts.svg) `recommended-gts`, 📋 `template-lint-migration`.

<!-- end auto-generated rule header -->

The HTML attribute `role` must never have the following values:

- `command`
- `composite`
- `input`
- `landmark`
- `range`
- `roletype`
- `section`
- `sectionhead`
- `select`
- `structure`
- `widget`
- `window`

## Examples

This rule **forbids** the following:

```hbs
<div role='window'> Hello, world! </div>
```

This rule **allows** the following:

```hbs
<div role='button'> Push it </div>
```

## References

- See [https://www.w3.org/TR/wai-aria-1.0/roles#abstract_roles](https://www.w3.org/TR/wai-aria-1.0/roles#abstract_roles)
