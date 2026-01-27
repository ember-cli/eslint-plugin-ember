# ember/template-no-action-modifiers

> **HBS Only**: This rule applies to classic `.hbs` template files only (loose mode). It is not relevant for `gjs`/`gts` files (strict mode), where these patterns cannot occur.

<!-- end auto-generated rule header -->

Disallow usage of `{{action}}` modifiers in templates.

The `{{action}}` modifier has been deprecated in favor of the `{{on}}` modifier. The `{{on}}` modifier provides a more explicit and flexible way to handle events.

## Rule Details

This rule disallows using `{{action}}` as an element modifier.

## Examples

### Incorrect ❌

```hbs
<button {{action 'save'}}>Save</button>
```

```hbs
<div {{action 'onClick'}}>Click me</div>
```

```hbs
<form {{action 'submit' on='submit'}}>Submit</form>
```

### Correct ✅

```hbs
<button {{on 'click' this.handleClick}}>Save</button>
```

```hbs
<div {{on 'click' this.onClick}}>Click me</div>
```

```hbs
<form {{on 'submit' this.handleSubmit}}>Submit</form>
```

## Related Rules

- [template-no-action](./template-no-action.md)

## References

- [Ember Octane Guide - Element Modifiers](https://guides.emberjs.com/release/components/template-lifecycle-dom-and-modifiers/)
- [eslint-plugin-ember template-no-action](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-action.md)
