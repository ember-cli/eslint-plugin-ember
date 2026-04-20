# ember/template-no-potential-path-strings

💼 This rule is enabled in the 📋 `template-lint-migration` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

It might happen sometimes that `{{` and `}}` are forgotten when invoking a component, and the string that is passed was actually supposed to be a property path or argument.

This rule warns about all arguments and attributes that start with `this.` or `@`, but are missing the surrounding `{{` and `}}` characters.

## Examples

This rule **forbids** the following:

```hbs
<img src='this.picture' />
```

```hbs
<img src='@img' />
```

This rule **allows** the following:

```hbs
<img src={{this.picture}} />
```

```hbs
<img src={{@img}} />
```

## Migration

- Replace the surrounding `"` characters with `{{`/`}}`

## Related Rules

- [no-arguments-for-html-elements](template-no-arguments-for-html-elements.md)

## References

- [Component Arguments and HTML Attributes](https://guides.emberjs.com/release/components/component-arguments-and-html-attributes/)
