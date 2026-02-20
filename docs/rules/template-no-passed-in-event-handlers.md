# ember/template-no-passed-in-event-handlers

<!-- end auto-generated rule header -->

Disallows passing event handlers directly as component arguments.

Instead of passing event handlers like `@onClick` to components, use the `{{on}}` modifier directly on the element. This is more explicit and follows modern Ember patterns.

## Rule Details

This rule detects component arguments that follow the pattern `@on[EventName]` (e.g., `@onClick`, `@onSubmit`).

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <MyComponent @onClick={{this.handleClick}} />
</template>
```

```gjs
<template>
  <MyComponent @onSubmit={{this.handleSubmit}} />
</template>
```

```gjs
<template>
  <CustomButton @onHover={{this.handleHover}} />
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
          MyComponent: ['click', 'submit'],
        },
      },
    ],
  },
};
```

## Migration

Replace:

```gjs
<MyComponent @onClick={{this.handleClick}} />
```

With:

```gjs
<MyComponent>
  <button {{on "click" this.handleClick}}>Click</button>
</MyComponent>
```

## References

- [eslint-plugin-ember template-no-passed-in-event-handlers](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-passed-in-event-handlers.md)
