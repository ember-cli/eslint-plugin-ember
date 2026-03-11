# ember/template-attribute-order

<!-- end auto-generated rule header -->

Enforces a consistent ordering of attributes in template elements. This helps improve readability and maintainability of templates.

## Rule Details

This rule enforces a consistent order for attributes on template elements. By default, attributes are ordered by type group:

1. **Arguments** — `@argName` (Glimmer component arguments)
2. **Attributes** — standard HTML attributes like `class`, `id`, `role`
3. **Modifiers** — `{{on "click" ...}}`, `{{did-insert ...}}`, etc.

Within each group, attributes are sorted alphabetically by default.

Additional groups (`splattributes` and `comments`) can be added to the ordering if needed.

Hash pairs in curly invocations (mustache/block statements) are also alphabetized when `alphabetize` is enabled.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <MyComponent class="btn" @onClick={{this.go}} @label="hi" />
</template>
```

In this example, `class` (an attribute) appears before `@onClick` and `@label` (arguments). Arguments should come first.

```gjs
<template>
  <MyComponent @label="hi" @action={{this.go}} />
</template>
```

Here, `@label` and `@action` are out of alphabetical order within the arguments group.

Examples of **correct** code for this rule:

```gjs
<template>
  <MyComponent @action={{this.go}} @label="hi" class="btn" />
</template>
```

```gjs
<template>
  <div class="container" id="main" {{on "click" this.handleClick}}></div>
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
