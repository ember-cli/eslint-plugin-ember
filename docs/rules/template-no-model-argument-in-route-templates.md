# ember/template-no-model-argument-in-route-templates

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

✅ The `extends: 'plugin:ember/strict-gjs'` or `extends: 'plugin:ember/strict-gts'` property in a configuration file enables this rule.

In Ember route templates, the model should be accessed via `this.model` in the controller or component, not as an `@model` argument. The `@model` argument pattern is more appropriate for components. This rule primarily targets `.hbs` files in the `templates/` directory.

## Rule Details

This rule disallows the use of `@model` argument in route templates (`.hbs` files in `templates/` directory).

## Examples

Examples of **incorrect** code for this rule (in route templates):

```hbs
<!-- app/templates/index.hbs -->
{{@model}}
```

```hbs
<!-- app/templates/users.hbs -->
{{@model.name}}
```

```hbs
<!-- app/templates/posts/show.hbs -->
{{@model.id}}
```

Examples of **correct** code for this rule:

```hbs
<!-- app/templates/index.hbs -->
{{this.model}}
```

```gjs
// app/components/user-card.gjs
<template>
  {{@model.name}}
</template>
```

```gjs
<template>
  {{this.model}}
</template>
```

## References

- [eslint-plugin-ember template-no-model-argument-in-route-templates](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-model-argument-in-route-templates.md)
- [Ember Guides: Controllers](https://guides.emberjs.com/release/routing/controllers/)

<!-- begin auto-generated rule meta list -->

- strictGjs: true
- strictGts: true
<!-- end auto-generated rule meta list -->
