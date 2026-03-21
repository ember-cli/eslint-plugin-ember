# ember/template-no-unnecessary-component-helper

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

> **HBS Only**: This rule applies to classic `.hbs` template files only (loose mode). It is not relevant for `gjs`/`gts` files (strict mode), where these patterns cannot occur.

<!-- end auto-generated rule header -->

The `component` template helper can be used to dynamically pick the component being rendered based on the provided property. But if the component name is passed as a string because it's already known, then the component should be invoked directly, instead of using the `component` helper.

## Examples

This rule **forbids** the following:

```gjs
<template>
  {{component "my-component"}}
</template>
```

This rule **allows** the following:

```gjs
<template>
  {{component SOME_COMPONENT_NAME}}
</template>
```

```gjs
<template>
  {{!-- the `component` helper is needed to invoke this --}}
  {{component "addon-name@component-name"}}
</template>
```

```gjs
<template>
  {{my-component}}
</template>
```

```gjs
<template>
  {{my-component close=(component "link-to" "index")}}
  <MyComponent @close={{component "link-to" "index"}} />
</template>
```

## References

- [component helper guide](https://guides.emberjs.com/release/components/defining-a-component/#toc_dynamically-rendering-a-component)
- [component helper spec](https://www.emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/component?anchor=component)
