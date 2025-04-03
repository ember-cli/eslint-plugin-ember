# ember/no-builtin-form-components

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

This rule disallows the use of Ember's built-in form components (`Input` and `Textarea`) from `@ember/component` and encourages using native HTML elements instead.

## Rule Details

Ember's built-in form components (`Input` and `Textarea`) were designed to bridge the gap between classic HTML form elements and Ember's component system. However, as Ember has evolved, using native HTML elements with modifiers has become the preferred approach for several reasons:

- Native HTML elements have better accessibility support
- They provide a more consistent developer experience with standard web development
- They have better performance characteristics
- They avoid the extra abstraction layer that the built-in components provide

This rule helps identify where these built-in form components are being used so they can be replaced with native HTML elements.

## Examples

Examples of **incorrect** code for this rule:

```js
import { Input } from '@ember/component';
```

```js
import { Textarea } from '@ember/component';
```

```js
import { Input as EmberInput, Textarea as EmberTextarea } from '@ember/component';
```

Examples of **correct** code for this rule:

```hbs
<!-- Instead of using the Input component -->
<input 
  value={{this.value}}
  {{on "input" this.updateValue}}
/>

<!-- Instead of using the Textarea component -->
<textarea 
  value={{this.value}}
  {{on "input" this.updateValue}}
/>
```

## Migration

### Input Component

Replace:

```hbs
<Input @value={{this.value}} @type="text" @placeholder="Enter text" {{on "input" this.handleInput}} />
```

With:

```hbs
<input 
  value={{this.value}}
  type="text"
  placeholder="Enter text"
  {{on "input" this.handleInput}}
/>
```

### Textarea Component

Replace:

```hbs
<Textarea @value={{this.value}} @placeholder="Enter text" {{on "input" this.handleInput}} />
```

With:

```hbs
<textarea 
  value={{this.value}}
  placeholder="Enter text"
  {{on "input" this.handleInput}}
/>
```

## References

- [Ember Input Component API](https://api.emberjs.com/ember/release/classes/Input)
- [Ember Textarea Component API](https://api.emberjs.com/ember/release/classes/Textarea)
- [Ember Octane Modifier RFC](https://emberjs.github.io/rfcs/0373-element-modifiers.html)
