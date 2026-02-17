# ember/template-no-autofocus-attribute

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallows the use of `autofocus` attribute on elements.

The `autofocus` attribute can cause usability issues for both sighted and non-sighted users by disrupting expected behavior and screen reader announcements.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <input type="text" autofocus />
</template>
```

```gjs
<template>
  <textarea autofocus></textarea>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <input type="text" />
</template>
```

```gjs
<template>
  <textarea></textarea>
</template>
```

## When Not To Use It

If you need to autofocus for specific accessibility or UX requirements and have thoroughly tested with assistive technologies, you may disable this rule for those specific cases.

## References

- [ember-template-lint no-autofocus-attribute](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-autofocus-attribute.md)
- [MDN autofocus attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus)
