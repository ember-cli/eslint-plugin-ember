# ember/template-self-closing-void-elements

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallow or require self-closing void elements.

## Rule Details

Void elements (like `<img>`, `<br>`, `<input>`, etc.) cannot have child content. By default, this rule disallows redundant self-closing syntax (`/>`) on void elements since it's unnecessary in HTML.

## Config

This rule accepts a single option:

- `true` (default) — disallow self-closing void elements (e.g., `<br />` → `<br>`)
- `"require"` — require self-closing void elements (e.g., `<br>` → `<br />`)

## Examples

Examples of **incorrect** code for this rule (with default config):

```gjs
<template>
  <img src="foo.jpg" />
</template>
```

```gjs
<template>
  <br />
</template>
```

```gjs
<template>
  <input type="text" />
</template>
```

Examples of **correct** code for this rule (with default config):

```gjs
<template>
  <img src="foo.jpg">
</template>
```

```gjs
<template>
  <br>
</template>
```

```gjs
<template>
  <input type="text">
</template>
```

## References

- [eslint-plugin-ember template-self-closing-void-elements](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-self-closing-void-elements.md)
