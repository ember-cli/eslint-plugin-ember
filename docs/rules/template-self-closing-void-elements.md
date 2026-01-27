# ember/template-self-closing-void-elements

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Requires void elements to be self-closing.

## Rule Details

Void elements (like `<img>`, `<br>`, `<input>`, etc.) should be self-closing for consistency and to match HTML5 conventions.

## Examples

Examples of **incorrect** code for this rule:

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

Examples of **correct** code for this rule:

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

## References

- [eslint-plugin-ember template-self-closing-void-elements](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-self-closing-void-elements.md)
