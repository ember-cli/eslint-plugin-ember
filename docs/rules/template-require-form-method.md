# ember/template-require-form-method

<!-- end auto-generated rule header -->

Require form elements to have a method attribute.

Form elements should explicitly specify the HTTP method they use. This improves code clarity and helps catch potential issues.

## Examples

This rule **forbids** the following:

```hbs
<template>
  <form></form>
</template>
```

```hbs
<template>
  <form method='DELETE'></form>
</template>
```

This rule **allows** the following:

```hbs
<template>
  <form method='POST'></form>
</template>
```

```hbs
<template>
  <form method='GET'></form>
</template>
```

```hbs
<template>
  <form method='DIALOG'></form>
</template>
```

```hbs
<template>
  <form method='{{dynamicMethod}}'></form>
</template>
```

## Configuration

- `allowedMethods` (default: `['POST', 'GET', 'DIALOG']`) - Array of allowed form method values

```js
// .eslintrc.js
module.exports = {
  rules: {
    'ember/template-require-form-method': [
      'error',
      {
        allowedMethods: ['POST', 'GET'],
      },
    ],
  },
};
```

## References

- [HTML Spec - Form Method Attribute](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-method)
