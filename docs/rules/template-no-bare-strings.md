# ember/template-no-bare-strings

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Disallows bare strings in templates to encourage internationalization.

Bare strings in templates make internationalization (i18n) difficult. This rule encourages using translation helpers or properties to enable easy localization of your application.

## Rule Details

This rule disallows text content in templates that isn't wrapped in a translation helper or passed as a property.

The following are allowed:

- Whitespace-only strings
- Strings containing only numbers and punctuation
- Strings in an allowlist (configurable)

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div>Hello World</div>
</template>
```

```gjs
<template>
  <button>Click me</button>
</template>
```

```gjs
<template>
  <h1>Welcome to our app</h1>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div>{{t "hello.world"}}</div>
</template>
```

```gjs
<template>
  <button>{{@buttonText}}</button>
</template>
```

```gjs
<template>
  <div>123</div>
</template>
```

```gjs
<template>
  <div>   </div>
</template>
```

## Configuration

### `allowlist`

An array of strings that are allowed to appear as bare strings:

```js
module.exports = {
  rules: {
    'ember/template-no-bare-strings': [
      'error',
      {
        allowlist: ['Welcome', 'Home', 'About'],
      },
    ],
  },
};
```

### `globalAttributes`

An array of attribute names where bare strings will be checked (defaults to `["title", "aria-label", "alt", "placeholder"]`):

```js
module.exports = {
  rules: {
    'ember/template-no-bare-strings': [
      'error',
      {
        globalAttributes: ['title', 'aria-label', 'alt'],
      },
    ],
  },
};
```

## References

- [ember-template-lint no-bare-strings](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-bare-strings.md)
- [Ember Intl](https://github.com/ember-intl/ember-intl)
