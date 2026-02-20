# ember/template-no-unnecessary-curly-strings

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Strings need not be wrapped in the curly braces (mustache expressions).

## Examples

This rule **forbids** the following:

```hbs
<FooBar class={{'btn'}} />
```

```hbs
<FooBar class='btn'>{{'Hello'}}</FooBar>
```

This rule **allows** the following:

```hbs
<FooBar class='btn' />
```

```hbs
<FooBar class='btn'>Hello</FooBar>
```

## References

- [Handlebars expressions](https://handlebarsjs.com/guide/expressions.html)
