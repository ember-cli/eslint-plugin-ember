# ember/template-no-unnecessary-component-helper

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

> **HBS Only**: This rule applies to classic `.hbs` template files only (loose mode). It is not relevant for `gjs`/`gts` files (strict mode), where these patterns cannot occur.

<!-- end auto-generated rule header -->

Disallow unnecessary usage of the `{{component}}` helper with static component names.

## Rule Details

This rule disallows using `{{component "component-name"}}` when you could use angle bracket invocation instead.

## Examples

Examples of **incorrect** code for this rule:

```hbs
{{component 'my-component'}}
{{component 'MyComponent' arg='value'}}
```

Examples of **correct** code for this rule:

```hbs
<MyComponent />
{{component this.dynamicComponentName}}
{{component @componentName}}
```

## References

- [Ember Guides - Components](https://guides.emberjs.com/release/components/)
- [RFC #311 - Angle Bracket Invocation](https://github.com/emberjs/rfcs/blob/master/text/0311-angle-bracket-invocation.md)
