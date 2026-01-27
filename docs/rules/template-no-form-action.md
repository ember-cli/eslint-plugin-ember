# ember/template-no-form-action

<!-- end auto-generated rule header -->

Disallows the use of the `action` attribute on form elements.

In modern Ember applications, form submissions should be handled using the `{{on}}` modifier with the `"submit"` event instead of the `action` attribute. This provides better control and follows modern Ember patterns.

## Rule Details

This rule disallows the use of the `action` attribute on `<form>` elements.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <form action="/submit">
    <input type="text" />
  </form>
</template>
```

```gjs
<template>
  <form action="">
    <button>Submit</button>
  </form>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <form {{on "submit" this.handleSubmit}}>
    <input type="text" />
  </form>
</template>
```

```gjs
<template>
  <form>
    <button type="submit">Submit</button>
  </form>
</template>
```

## Migration

Replace:

```gjs
<form action="/submit">
```

With:

```gjs
<form {{on "submit" this.handleSubmit}}>
```

## References

- [eslint-plugin-ember template-no-form-action](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-form-action.md)
- [Ember.js Guides - Event Handling](https://guides.emberjs.com/release/components/component-state-and-actions/)
