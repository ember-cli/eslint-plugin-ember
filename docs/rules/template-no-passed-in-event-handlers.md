# ember/template-no-passed-in-event-handlers

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

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

- [ember-template-lint no-passed-in-event-handlers](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-passed-in-event-handlers.md)
