# ember/template-no-nested-interactive

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Disallows nested interactive elements in templates.

Nested interactive elements (like a button inside a link) are not accessible to keyboard and screen reader users. This creates confusion about which element is actually interactive and can cause unexpected behavior.

## Rule Details

This rule disallows nesting interactive elements inside other interactive elements.

Interactive elements include:
- `<a>`
- `<button>`
- `<details>`
- `<embed>`
- `<iframe>`
- `<label>`
- `<select>`
- `<textarea>`
- `<input>` (except `type="hidden"`)
- Elements with interactive ARIA roles

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <button>
    <a href="#">Link inside button</a>
  </button>
</template>
```

```gjs
<template>
  <a href="#">
    <button>Button inside link</button>
  </a>
</template>
```

```gjs
<template>
  <label>
    <button>Submit</button>
  </label>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div>
    <button>Button</button>
    <a href="#">Link</a>
  </div>
</template>
```

```gjs
<template>
  <button>Click me</button>
</template>
```

```gjs
<template>
  <label>
    <input type="text" />
    Label text
  </label>
</template>
```

## References

- [ember-template-lint no-nested-interactive](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-nested-interactive.md)
- [WCAG 2.1 - Interactive controls must not be nested](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)
