# ember/template-no-redundant-fn

💼 This rule is enabled in the 📋 `template-lint-migration` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

The `fn` helper can be used to bind arguments to another function. Using it without any arguments is redundant because then the inner function could just be used directly.

This rule is looking for `fn` helper usages that don't provide any additional arguments to the inner function and warns about them.

## Examples

This rule **forbids** the following:

```hbs
<button {{on 'click' (fn this.handleClick)}}>Click Me</button>
```

This rule **allows** the following:

```hbs
<button {{on 'click' this.handleClick}}>Click Me</button>
```

```hbs
<button {{on 'click' (fn this.handleClick 'foo')}}>Click Me</button>
```

## References

- [Ember Guides](https://guides.emberjs.com/release/components/component-state-and-actions/#toc_passing-arguments-to-actions)
- [`fn` API documentation](https://api.emberjs.com/ember/3.20/classes/Ember.Templates.helpers/methods/fn?anchor=fn)
