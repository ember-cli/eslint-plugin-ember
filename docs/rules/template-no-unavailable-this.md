# ember/template-no-unavailable-this

<!-- end auto-generated rule header -->

Disallow `this` in templates that are not inside a class or function.

## Rule Details

In Ember and Glimmer, `this` refers to the component instance. When a `<template>` tag is used at module level (not inside a class body or function), `this` has no meaningful value and will be `undefined`. This rule catches accidental usage of `this` in such templates.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{this.name}}
</template>
```

```gjs
<template>
  {{yield this}}
</template>
```

Examples of **correct** code for this rule:

```gjs
import Component from '@glimmer/component';

class MyComponent extends Component {
  <template>{{this.name}}</template>
}
```

```gjs
function myComponent() {
  return <template>{{this.name}}</template>;
}
```

```gjs
<template>
  {{@value}}
</template>
```

## References

- [Glimmer Components](https://guides.emberjs.com/release/upgrading/current-edition/glimmer-components/)

<!-- begin auto-generated rule meta list -->

- strictGjs: true
- strictGts: true
<!-- end auto-generated rule meta list -->
