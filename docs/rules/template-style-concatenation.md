# ember/template-style-concatenation

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Disallows string concatenation in inline styles.

String concatenation in style attributes can be error-prone and hard to maintain. Use the `{{html-safe}}` helper or a computed property instead.

## Rule Details

This rule disallows string concatenation in `style` attributes.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div style="color: {{this.color}};">Content</div>
</template>
```

```gjs
<template>
  <div style={{concat "width: " this.width "px;"}}>Content</div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div style="color: red;">Content</div>
</template>
```

```gjs
<template>
  <div style={{this.computedStyle}}>Content</div>
</template>
```

```gjs
<template>
  <div style={{html-safe this.styleString}}>Content</div>
</template>
```

## Migration

In your component:

```js
import { htmlSafe } from '@ember/template';

export default class MyComponent extends Component {
  get computedStyle() {
    return htmlSafe(`width: ${this.width}px; color: ${this.color};`);
  }
}
```

Then in template:

```gjs
<template>
  <div style={{this.computedStyle}}>Content</div>
</template>
```

## References

- [ember-template-lint style-concatenation](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/style-concatenation.md)
- [Ember.js Guides - htmlSafe](https://guides.emberjs.com/release/templates/writing-helpers/#toc_marking-strings-as-html-safe)
