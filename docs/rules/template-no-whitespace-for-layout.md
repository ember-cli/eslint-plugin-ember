# ember/template-no-whitespace-for-layout

<!-- end auto-generated rule header -->

✅ The `extends: 'plugin:ember/strict-gjs'` or `extends: 'plugin:ember/strict-gts'` property in a configuration file enables this rule.

Disallow using multiple consecutive spaces (3 or more) for layout purposes in templates. CSS should be used for spacing and layout instead.

## Rule Details

This rule discourages the use of multiple consecutive spaces (3 or more) for layout purposes in templates. CSS should be used for spacing and layout instead.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div>Hello   World</div>
</template>
```

```gjs
<template>
  <div>Text    with    spaces</div>
</template>
```

```gjs
<template>
  <div>Multiple     spaces</div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div>Hello World</div>
</template>
```

```gjs
<template>
  <div class="spaced-layout">Text with proper spacing</div>
</template>
```

```gjs
<template>
  <div>Hello  World</div>
</template>
```

## References

- [eslint-plugin-ember template-no-whitespace-for-layout](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-whitespace-for-layout.md)

<!-- begin auto-generated rule meta list -->

- strictGjs: true
- strictGts: true
<!-- end auto-generated rule meta list -->
