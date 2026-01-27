# ember/template-attribute-order

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

## Options

| Name          | Type       | Default                                    | Description                                                                                                                  |
| ------------- | ---------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `order`       | `string[]` | `["arguments", "attributes", "modifiers"]` | The order of token type groups. Valid values: `"arguments"`, `"attributes"`, `"modifiers"`, `"splattributes"`, `"comments"`. |
| `alphabetize` | `boolean`  | `true`                                     | Whether to alphabetize attributes within each group.                                                                         |

```js
module.exports = {
  rules: {
    'ember/template-attribute-order': [
      'error',
      {
        order: ['arguments', 'attributes', 'modifiers'],
        alphabetize: true,
      },
    ],
  },
};
```

## References

- [eslint-plugin-ember template-attribute-order](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-attribute-order.md)
