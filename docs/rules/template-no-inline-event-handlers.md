# ember/template-no-inline-event-handlers

<!-- end auto-generated rule header -->

Disallows DOM event handler attributes in templates.

Inline event handlers like `onclick="..."` are an older pattern that should be replaced with the `{{on}}` modifier for better Ember integration and testability.

## Rule Details

This rule disallows the use of inline DOM event handler attributes like `onclick`, `onsubmit`, etc.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <button onclick="alert('test')">Click</button>
</template>
```

```gjs
<template>
  <div onmousedown="handleEvent()">Content</div>
</template>
```

```gjs
<template>
  <form onsubmit="return false;">Form</form>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <button {{on "click" this.handleClick}}>Click</button>
</template>
```

```gjs
<template>
  <input {{on "input" this.handleInput}} />
</template>
```

```gjs
<template>
  <form {{on "submit" this.handleSubmit}}>Form</form>
</template>
```

## Migration

Replace:

```gjs
<button onclick="alert('clicked')">
```

With:

```gjs
<button {{on "click" this.handleClick}}>
```

## References

- [Ember.js Guides - Event Handling](https://guides.emberjs.com/release/components/component-state-and-actions/)
- [eslint-plugin-ember template-no-inline-styles](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-inline-styles.md)
