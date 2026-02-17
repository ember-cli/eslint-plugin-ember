# ember/template-no-accesskey-attribute

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallows the use of `accesskey` attribute on elements.

The `accesskey` attribute creates inconsistencies between keyboard shortcuts and keyboard commands used by screen readers and keyboard-only users, causing accessibility issues.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <button accesskey="s">Save</button>
</template>
```

```gjs
<template>
  <a href="#" accesskey="h">Home</a>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <button>Save</button>
</template>
```

```gjs
<template>
  <a href="#">Home</a>
</template>
```

## References

- [ember-template-lint no-accesskey-attribute](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-accesskey-attribute.md)
- [WebAIM: Keyboard Accessibility - Accesskey](https://webaim.org/techniques/keyboard/accesskey)
