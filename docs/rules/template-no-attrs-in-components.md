# ember/template-no-attrs-in-components

<!-- end auto-generated rule header -->

This rule prevents the usage of `this.attrs` property to access values passed to the component. Use `@arg` syntax instead.

## Examples

This rule **forbids** the following:

```hbs
{{this.attrs.foo}}
```

This rule **allows** the following:

```hbs
{{@foo}}
```

## References

- [rfcs/named args](https://github.com/emberjs/rfcs/blob/master/text/0276-named-args.md#motivation)
