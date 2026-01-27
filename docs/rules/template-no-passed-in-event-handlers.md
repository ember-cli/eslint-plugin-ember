# ember/template-no-passed-in-event-handlers

<!-- end auto-generated rule header -->

Disallows passing Ember event handler names directly as component arguments.

Passing Ember DOM event names as component arguments (e.g., `@click`, `@submit`, `@keyDown`) is discouraged. Use the `{{on}}` modifier on the element instead for explicit event binding.

## Rule Details

This rule detects component arguments whose name (without the `@` prefix) matches an Ember DOM event name. Only PascalCase component invocations are checked (built-in `Input` and `Textarea` are excluded).

The checked event names are:

`touchStart`, `touchMove`, `touchEnd`, `touchCancel`, `keyDown`, `keyUp`, `keyPress`, `mouseDown`, `mouseUp`, `contextMenu`, `click`, `doubleClick`, `mouseMove`, `mouseEnter`, `mouseLeave`, `focusIn`, `focusOut`, `submit`, `change`, `input`, `dragStart`, `drag`, `dragEnter`, `dragLeave`, `dragOver`, `dragEnd`, `drop`

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <MyComponent @click={{this.handleClick}} />
</template>
```

```gjs
<template>
  <MyComponent @submit={{this.handleSubmit}} />
</template>
```

```gjs
<template>
  <CustomButton @mouseEnter={{this.handleHover}} />
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <MyComponent @action={{this.handleAction}} />
</template>
```

```gjs
<template>
  <button {{on "click" this.handleClick}}>Click</button>
</template>
```

```gjs
<template>
  <MyComponent @value={{this.value}} @onChange={{this.updateValue}} />
</template>
```

## Options

| Name     | Type     | Default | Description                                                                                        |
| -------- | -------- | ------- | -------------------------------------------------------------------------------------------------- |
| `ignore` | `object` | `{}`    | Per-component exceptions. Keys are component names, values are arrays of argument names to ignore. |

```js
module.exports = {
  rules: {
    'ember/template-no-passed-in-event-handlers': [
      'error',
      {
        ignore: {
          MyComponent: ['@click', '@submit'],
        },
      },
    ],
  },
};
```

## Migration

Replace:

```gjs
<MyComponent @click={{this.handleClick}} />
```

With:

```gjs
<MyComponent>
  <button {{on "click" this.handleClick}}>Click</button>
</MyComponent>
```

## References

- [eslint-plugin-ember template-no-passed-in-event-handlers](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-passed-in-event-handlers.md)
