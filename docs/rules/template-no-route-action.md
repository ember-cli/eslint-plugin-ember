# ember/template-no-route-action

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Disallows the use of the `{{route-action}}` helper.

The `route-action` helper from `ember-route-action-helper` is deprecated. Modern Ember applications should use the `{{fn}}` helper or closure actions instead.

## Rule Details

This rule disallows the use of `{{route-action}}` in templates.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{route-action "save"}}
</template>
```

```gjs
<template>
  <button {{on "click" (route-action "save")}}>Save</button>
</template>
```

```gjs
<template>
  <Component @action={{route-action "update"}} />
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <button {{on "click" (fn this.save)}}>Save</button>
</template>
```

```gjs
<template>
  <button {{on "click" this.handleClick}}>Click</button>
</template>
```

```gjs
<template>
  <Component @action={{this.handleAction}} />
</template>
```

## Migration

Replace:
```gjs
<button {{on "click" (route-action "save" model)}}>Save</button>
```

With:
```gjs
<button {{on "click" (fn this.save model)}}>Save</button>
```

## References

- [ember-template-lint no-route-action](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-route-action.md)
- [Ember.js Guides - Actions](https://guides.emberjs.com/release/components/component-state-and-actions/)
