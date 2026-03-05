# ember/template-no-action

<!-- end auto-generated rule header -->

> **HBS Only**: This rule applies to classic `.hbs` template files only (loose mode). It is not relevant for `gjs`/`gts` files (strict mode), where these patterns cannot occur.

Disallows the use of `{{action}}` helper.

The `{{action}}` helper is deprecated in favor of the `{{on}}` modifier and `{{fn}}` helper, which provide better performance and clearer intent.

## Examples

Examples of **incorrect** code for this rule:

```hbs
<button {{on 'click' (action 'save')}}>Save</button>
```

```hbs
{{action 'doSomething'}}
```

Examples of **correct** code for this rule:

```hbs
<button {{on 'click' this.save}}>Save</button>
```

```hbs
<button {{on 'click' (fn this.save 'arg')}}>Save with arg</button>
```

```hbs
{{this.action}}
```

## Migration

- Replace `(action "methodName")` with method references or `(fn this.methodName)`
- Replace `<button onclick={{action ...}}>` with `<button {{on "click" ...}}>`

## Related Rules

- [no-action-modifiers](template-no-action-modifiers.md)
- [no-element-event-actions](template-no-element-event-actions.md)
- [no-mut-helper](template-no-mut-helper.md)

## References

- [eslint-plugin-ember template-no-action](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-action.md)
- [Ember.js Deprecations - action helper](https://deprecations.emberjs.com/v3.x/#toc_action-helper)
- [Ember Modifier Documentation](https://guides.emberjs.com/release/components/template-lifecycle-dom-and-modifiers/)
