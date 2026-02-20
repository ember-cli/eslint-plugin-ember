# ember/template-no-restricted-invocations

<!-- end auto-generated rule header -->

Disallow certain components, helpers or modifiers from being used.

Use cases include:

- You bring in some addon with helpers or components, but your team deems one or many not suitable and wants to guard against their usage
- You want to discourage use of a deprecated component

## Examples

Given a config of:

```json
{ "template-no-restricted-invocations": ["foo-bar"] }
```

This rule **forbids** the following:

```hbs
<template>{{foo-bar}}</template>
```

```hbs
<template>{{#foo-bar}}{{/foo-bar}}</template>
```

```hbs
<template><FooBar /></template>
```

This rule **allows** the following:

```hbs
<template>{{baz}}</template>
```

```hbs
<template><Baz /></template>
```

## Configuration

One of these:

- `string[]` - helpers or components to disallow (using kebab-case names like `nested-scope/component-name`)
- `object[]` - with the following keys:
  - `names` - `string[]` - helpers or components to disallow
  - `message` - `string` - custom error message to report for violations

```js
// .eslintrc.js
module.exports = {
  rules: {
    'ember/template-no-restricted-invocations': [
      'error',
      [
        'foo-bar',
        {
          names: ['deprecated-component'],
          message: 'Use new-component instead',
        },
      ],
    ],
  },
};
```

## References

- [emberjs.com - Deprecations](https://guides.emberjs.com/release/deprecations/)
