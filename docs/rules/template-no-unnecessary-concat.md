# ember/template-no-unnecessary-concat

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

💅 The `extends: 'stylistic'` property in a configuration file enables this rule.

This rule forbids unnecessary use of quotes (`""`) around expressions like `{{myValue}}`.

## Examples

This rule **forbids** the following:

```gjs
<template>
  <span class="{{if errors.length 'text-danger' 'text-grey'}}">

  <img src="{{customSrc}}" alt="{{customAlt}}">

  <label for="{{concat elementId "-date"}}">
</template>
```

This rule **allows** the following:

```gjs
<template>
  <span class={{if errors.length 'text-danger' 'text-grey'}}>

  <img src={{customSrc}} alt={{customAlt}}>

  <label for={{concat elementId "-date"}}>
</template>
```

## Migration

Use regexp find-and-replace to fix existing violations of this rule:

| Before           | After     |
| ---------------- | --------- |
| `="{{([^}]+)}}"` | `={{$1}}` |

## References

- [Handlebars docs/expressions](https://handlebarsjs.com/guide/expressions.html)
- [Ember api/concat helper](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/concat?anchor=concat)
