# ember/template-no-whitespace-for-layout

<!-- end auto-generated rule header -->

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

## Migration

To fix issues caused by using whitespace for layout, the following are recommended:

* use the appropriate HTML markup to contain the information
* use CSS to add padding or margins to the semantic HTML markup

## References

- [eslint-plugin-ember template-no-whitespace-for-layout](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-whitespace-for-layout.md)
