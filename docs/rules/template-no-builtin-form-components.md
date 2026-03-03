# ember/template-no-builtin-form-components

<!-- end auto-generated rule header -->

Disallow usage of Ember's built-in `<Input>` and `<Textarea>` components. These components use two-way binding to mutate values, which is considered an anti-pattern. Use native HTML `<input>` and `<textarea>` elements instead.

## Examples

This rule **forbids** the following:

```gjs
<template><Input @type="text" @value={{this.name}} /></template>
```

```gjs
<template><Textarea @value={{this.body}}></Textarea></template>
```

This rule **allows** the following:

```gjs
<template><input type="text" value={{this.name}} {{on "input" this.handleInput}} /></template>
```

```gjs
<template><textarea {{on "input" this.handleInput}}>{{this.body}}</textarea></template>
```

## References

- [Ember Built-in Components](https://guides.emberjs.com/release/components/built-in-components/)
- [ember-template-lint no-builtin-form-components](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-builtin-form-components.md)
