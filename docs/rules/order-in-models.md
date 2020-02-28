# order-in-models

## Configuration

```js
ember/order-in-models: [2, {
  order: [
    'attribute',
    'relationship',
    'single-line-function',
    'multi-line-function',
  ]
}]
```

If you want some of properties to be treated equally in order you can group them into arrays, like so:

```js
order: [
  'attribute',
  'relationship',
  ['single-line-function', 'multi-line-function'],
]
```

### Custom Properties

If you would like to specify ordering for a property type that is not listed, you can use the custom property syntax `custom:myPropertyName` in the order list to specify where the property should go.

### Additional Properties

You can find the full list of properties [here](/lib/utils/property-order.js#L10).

## Description

You should write code grouped and ordered in this way:

1. Attributes
2. Relations
3. Single line computed properties
4. Multiline computed properties
5. Other structures (custom methods etc.)

```javascript
// GOOD
export default Model.extend({
  // 1. Attributes
  shape: attr('string'),

  // 2. Relations
  behaviors: hasMany('behaviour'),

  // 3. Computed Properties
  mood: computed('health', 'hunger', function() {
    const result = this.get('health') * this.get('hunger');
    return result;
  })
});

// BAD
export default Model.extend({
  mood: computed('health', 'hunger', function() {
    const result = this.get('health') * this.get('hunger');
    return result;
  }),

  hat: attr('string'),

  behaviors: hasMany('behaviour'),

  shape: attr('string')
});
```

## Help Wanted

| Issue | Link |
| :-- | :-- |
| :x: Missing native JavaScript class support | [#560](https://github.com/ember-cli/eslint-plugin-ember/issues/560) |
