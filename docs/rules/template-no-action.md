# ember/template-no-action

<!-- end auto-generated rule header -->

Disallows the use of `{{action}}` helper.

The `{{action}}` helper is deprecated in favor of the `{{on}}` modifier and `{{fn}}` helper, which provide better performance and clearer intent.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <button {{on "click" (action "save")}}>Save</button>
</template>
```

```gjs
<template>
  {{action "doSomething"}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <button {{on "click" this.save}}>Save</button>
</template>
```

```gjs
<template>
  <button {{on "click" (fn this.save "arg")}}>Save with arg</button>
</template>
```

```gjs
<template>
  {{this.action}}
</template>
```

## Migration

- Replace `(action "methodName")` with method references or `(fn this.methodName)`
- Replace `<button onclick={{action ...}}>` with `<button {{on "click" ...}}>`

## References

- [eslint-plugin-ember template-no-action](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-action.md)
- [Ember.js Deprecations - action helper](https://deprecations.emberjs.com/v3.x/#toc_action-helper)
- [Ember Modifier Documentation](https://guides.emberjs.com/release/components/template-lifecycle-dom-and-modifiers/)
