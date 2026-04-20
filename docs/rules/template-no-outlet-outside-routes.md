# ember/template-no-outlet-outside-routes

💼 This rule is enabled in the 📋 `template-lint-migration` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Disallow `{{outlet}}` outside of route templates. The `outlet` helper should only be used in route templates to render nested routes.

## Rule Details

This rule prevents the use of `{{outlet}}` in component templates where it doesn't make sense.

## Examples

Examples of **incorrect** code for this rule:

```gjs
// In a component template
<template>
  <div>
    {{outlet}}
  </div>
</template>
```

Examples of **correct** code for this rule:

```gjs
// In a component template
<template>
  <div>Content</div>
</template>
```

## References

- [Ember guides/routing](https://guides.emberjs.com/release/routing/rendering-a-template/)
- [Ember api/outlet helper](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/outlet?anchor=outlet)
- [ember-template-lint no-outlet-outside-routes](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-outlet-outside-routes.md)
