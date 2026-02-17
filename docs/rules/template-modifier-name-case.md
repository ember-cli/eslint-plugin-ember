# ember/template-modifier-name-case

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Requires dasherized names for modifiers.

Modifiers should use dasherized names when being invoked, not camelCase. This is a stylistic rule that will prevent you from using camelCase modifiers, requiring you to use dasherized modifier names instead.

## Examples

This rule **forbids** the following:

```hbs
<div {{didInsert}}></div>
```

```hbs
<div {{onFocus}}></div>
```

```hbs
<div {{modifier 'didInsert'}}></div>
```

This rule **allows** the following:

```hbs
<div {{did-insert}}></div>
```

```hbs
<div {{on-focus}}></div>
```

```hbs
<div {{modifier 'did-insert'}}></div>
```

## See Also

- [named-functions-in-promises](named-functions-in-promises.md)

## References

- [Template syntax guide - Modifiers](https://guides.emberjs.com/release/components/template-syntax/#toc_modifiers)
