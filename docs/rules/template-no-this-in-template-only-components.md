# ember/template-no-this-in-template-only-components

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

There is no `this` context in template-only components.

## Examples

This rule **forbids** `this` in template-only components:

```hbs
<h1>Hello {{this.name}}!</h1>
```

The `--fix` option will convert to named arguments:

```hbs
<h1>Hello {{@name}}!</h1>
```

## Migration

- use [ember-no-implicit-this-codemod](https://github.com/ember-codemods/ember-no-implicit-this-codemod)
- [upgrade to Glimmer components](https://guides.emberjs.com/release/upgrading/current-edition/glimmer-components/), which don't allow ambiguous access
  - classic components have [auto-reflection](https://github.com/emberjs/rfcs/blob/master/text/0276-named-args.md#motivation), and can use `this.myArgName` or `this.args.myArgNme` or `@myArgName` interchangeably

## References

- [Glimmer components](https://guides.emberjs.com/release/upgrading/current-edition/glimmer-components/)
- [rfcs/named args](https://github.com/emberjs/rfcs/blob/master/text/0276-named-args.md#motivation)
