# ember/template-no-action-on-submit-button

<!-- end auto-generated rule header -->

Disallow `action` attribute on submit buttons.

Using the `action` attribute on submit buttons is a common mistake. Instead, you should use the `{{on}}` modifier to handle click events, or handle form submission at the form level.

## Rule Details

This rule disallows using the `action` attribute on `<button>` elements (which default to type="submit") and `<input type="submit">` elements.

## Examples

### Incorrect ❌

```gjs
<template>
  <button action="save">Save</button>
</template>
```

```gjs
<template>
  <button type="submit" action="submit">Submit</button>
</template>
```

```gjs
<template>
  <input type="submit" action="go" />
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
  <button type="button" action="doSomething">Click</button>
</template>
```

```gjs
<template>
  <form {{on "submit" this.handleSubmit}}>
    <button type="submit">Submit</button>
  </form>
</template>
```

## Related Rules

- [template-no-action-modifiers](./template-no-action-modifiers.md)

## References

- [eslint-plugin-ember template-no-invalid-interactive](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-invalid-interactive.md)
