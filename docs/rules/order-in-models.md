# ember/order-in-models

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Note: this rule will not be added to the `recommended` configuration because it enforces an opinionated, stylistic preference.

## Configuration

<!-- begin auto-generated rule options list -->

| Name    | Type  |
| :------ | :---- |
| `order` | Array |

<!-- end auto-generated rule options list -->

```js
const rules = {
  'ember/order-in-models': [
    2,
    {
      order: ['spread', 'attribute', 'relationship', 'single-line-function', 'multi-line-function'],
    },
  ],
};
```

If you want some of properties to be treated equally in order you can group them into arrays, like so:

```js
order: ['attribute', 'relationship', ['single-line-function', 'multi-line-function']];
```

### Custom Properties

If you would like to specify ordering for a property type that is not listed, you can use the custom property syntax `custom:myPropertyName` in the order list to specify where the property should go.

### Additional Properties

You can find the full list of properties [in property-order.js](../../lib/utils/property-order.js#L10).

## Description

You should write code grouped and ordered in this way:

1. Attributes
2. Relations
3. Single line computed properties
4. Multiline computed properties
5. Other structures (custom methods etc.)

This rule checks ordering only; it does not enforce indentation or other whitespace formatting.

## Examples

```js
// GOOD
export default Model.extend({
  // 1. Attributes
  shape: attr('string'),

  // 2. Relations
  behaviors: hasMany('behaviour'),

  // 3. Computed Properties
  mood: computed('health', 'hunger', function () {
    const result = this.health * this.hunger;
    return result;
  }),
});
```

```js
// BAD
export default Model.extend({
  mood: computed('health', 'hunger', function () {
    const result = this.health * this.hunger;
    return result;
  }),

  hat: attr('string'),

  behaviors: hasMany('behaviour'),

  shape: attr('string'),
});
```
