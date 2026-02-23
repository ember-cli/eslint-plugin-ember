# ember/template-no-invalid-interactive

<!-- end auto-generated rule header -->

> Disallow non-interactive elements with interactive handlers

## Rule Details

This rule prevents adding interactive event handlers (like `onclick`, `onkeydown`, etc.) to non-interactive HTML elements without proper ARIA roles.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div onclick={{this.handleClick}}>Click me</div>
</template>
```

```gjs
<template>
  <span onkeydown={{this.handleKey}}>Press key</span>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <button onclick={{this.handleClick}}>Click me</button>
</template>
```

```gjs
<template>
  <div role="button" onclick={{this.handleClick}}>Click me</div>
</template>
```

```gjs
<template>
  <button {{on "click" this.handleClick}}>Click me</button>
</template>
```

## Options

| Name                        | Type       | Default | Description                                                 |
| --------------------------- | ---------- | ------- | ----------------------------------------------------------- |
| `additionalInteractiveTags` | `string[]` | `[]`    | Extra tag names to treat as interactive.                    |
| `ignoredTags`               | `string[]` | `[]`    | Tag names to skip checking.                                 |
| `ignoreTabindex`            | `boolean`  | `false` | If `true`, `tabindex` does not make an element interactive. |
| `ignoreUsemap`              | `boolean`  | `false` | If `true`, `usemap` does not make an element interactive.   |

## References

- [WCAG 2.1 - 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)
- [eslint-plugin-ember template-no-invalid-interactive](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-invalid-interactive.md)
