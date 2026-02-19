# ember/template-no-action-modifiers

<!-- end auto-generated rule header -->

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

Disallow usage of `{{action}}` modifiers in templates.

The `{{action}}` modifier has been deprecated in favor of the `{{on}}` modifier. The `{{on}}` modifier provides a more explicit and flexible way to handle events.

## Rule Details

This rule disallows using `{{action}}` as an element modifier.

## Examples

### Incorrect ❌

```gjs
<template>
  <button {{action "save"}}>Save</button>
</template>
```

```gjs
<template>
  <div {{action "onClick"}}>Click me</div>
</template>
```

```gjs
<template>
  <form {{action "submit" on="submit"}}>Submit</form>
</template>
```

### Correct ✅

```gjs
<template>
  <button {{on "click" this.handleClick}}>Save</button>
</template>
```

```gjs
<template>
  <div {{on "click" this.onClick}}>Click me</div>
</template>
```

```gjs
<template>
  <form {{on "submit" this.handleSubmit}}>Submit</form>
</template>
```

## Related Rules

- [template-no-action](./template-no-action.md)

## References

- [Ember Octane Guide - Element Modifiers](https://guides.emberjs.com/release/components/template-lifecycle-dom-and-modifiers/)
- [eslint-plugin-ember template-no-action](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-action.md)
