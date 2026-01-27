# ember/template-attribute-order

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Enforces a consistent ordering of attributes in template elements. This helps improve readability and maintainability of templates.

## Rule Details

This rule enforces a consistent order for attributes on template elements. By default, it follows this order:

1. `class`
2. `id`
3. `role`
4. `aria-*` attributes
5. `data-test-*` attributes
6. `type`
7. `name`
8. `value`
9. `placeholder`
10. `disabled`

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div id="main" class="container"></div>
</template>
```

```gjs
<template>
  <button aria-label="Submit" role="button">Send</button>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div class="container" id="main"></div>
</template>
```

```gjs
<template>
  <button class="btn" role="button" aria-label="Submit">Send</button>
</template>
```

## Configuration

You can customize the order by providing an `order` array:

```js
module.exports = {
  rules: {
    'ember/template-attribute-order': [
      'error',
      {
        order: ['class', 'id', 'role', 'aria-', 'type'],
      },
    ],
  },
};
```

## References

- [ember-template-lint attribute-order](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/attribute-order.md)
