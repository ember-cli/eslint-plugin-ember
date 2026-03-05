# ember/template-no-route-action

<!-- end auto-generated rule header -->

> **HBS Only**: This rule applies to classic `.hbs` template files only (loose mode). It is not relevant for `gjs`/`gts` files (strict mode), where these patterns cannot occur.

Disallows the use of the `{{route-action}}` helper.

The `route-action` helper from `ember-route-action-helper` is deprecated. Modern Ember applications should use the `{{fn}}` helper or closure actions instead.

## Rule Details

This rule disallows the use of `{{route-action}}` in templates.

## Examples

Examples of **incorrect** code for this rule:

```hbs
{{route-action 'save'}}
```

```hbs
<button {{on 'click' (route-action 'save')}}>Save</button>
```

```hbs
<Component @action={{route-action 'update'}} />
```

Examples of **correct** code for this rule:

```hbs
<button {{on 'click' (fn this.save)}}>Save</button>
```

```hbs
<button {{on 'click' this.handleClick}}>Click</button>
```

```hbs
<Component @action={{this.handleAction}} />
```

## Migration

Replace:

```hbs
<button {{on 'click' (route-action 'save' model)}}>Save</button>
```

With:

```hbs
<button {{on 'click' (fn this.save model)}}>Save</button>
```

## References

- [eslint-plugin-ember template-no-route-action](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-route-action.md)
- [Ember.js Guides - Actions](https://guides.emberjs.com/release/components/component-state-and-actions/)
