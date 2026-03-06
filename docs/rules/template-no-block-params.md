# ember/template-no-block-params

<!-- end auto-generated rule header -->

Disallow the use of block params (`as |...|`).

## Rule Details

This rule disallows all usage of block params syntax (`as |...|`) in templates. This includes:

- Angle-bracket component invocations: `<MyComponent as |item|>`
- Curly component invocations: `{{#my-component as |val|}}`
- Built-in helpers: `{{#each items as |item|}}`, `{{#let val as |v|}}`
- HTML elements: `<div as |content|>`

This is a strict rule for codebases that want to completely avoid block params in favor of alternative patterns (e.g., contextual helpers, direct property access, or explicit argument passing).

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <MyComponent as |item|>
    {{item.name}}
  </MyComponent>
</template>
```

```gjs
<template>
  {{#each this.items as |item index|}}
    <li>{{index}}: {{item}}</li>
  {{/each}}
</template>
```

```gjs
<template>
  {{#let this.computedValue as |val|}}
    {{val}}
  {{/let}}
</template>
```

```gjs
<template>
  {{#my-component as |api|}}
    {{api.doSomething}}
  {{/my-component}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <MyComponent />
</template>
```

```gjs
<template>
  <MyComponent>
    Content without block params
  </MyComponent>
</template>
```

```gjs
<template>
  {{my-helper this.value}}
</template>
```

```gjs
<template>
  {{yield}}
</template>
```

## Related Rules

- [template-no-block-params-for-html-elements](template-no-block-params-for-html-elements.md) — only disallows block params on HTML elements
- [template-no-unused-block-params](template-no-unused-block-params.md) — disallows block params that are declared but never used
