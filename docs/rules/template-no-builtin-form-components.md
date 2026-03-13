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

## Migration

Many forms may be simplified by switching to a light one-way data approach.

For example – vanilla JavaScript has everything we need to handle form data, de-sync it from our source data and collect all user input in a single object.

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MyComponent extends Component {
  @tracked userInput = {};

  @action
  handleInput(event) {
    const formData = new FormData(event.currentTarget);
    this.userInput = Object.fromEntries(formData.entries());
  }
}
```

```hbs
<form {{on 'input' this.handleInput}}>
  <label>
    Name
    <input name='name' />
  </label>
</form>
```

Another option would is to "control" the field's value by replacing the built-in form component with a native HTML element and binding an event listener to handle user input.

In the following example the initial value of a field is controlled by a local tracked property, which is updated by an event listener.

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MyComponent extends Component {
  @tracked name;

  @action
  updateName(event) {
    this.name = event.target.value;
  }
}
```

```hbs
<input type='text' value={{this.name}} {{on 'input' this.updateName}} />
```

## Related Rules

- [no-mut-helper](template-no-mut-helper.md)

## References

- [Ember Built-in Components](https://guides.emberjs.com/release/components/built-in-components/)
- [ember-template-lint no-builtin-form-components](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-builtin-form-components.md)
