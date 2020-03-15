# order-in-controllers

## Configuration

```js
const rules = {
  'ember/order-in-controllers': [
    2,
    {
      order: [
        'controller',
        'service',
        'query-params',
        'inherited-property',
        'property',
        'single-line-function',
        'multi-line-function',
        'observer',
        'actions',
        ['method', 'empty-method']
      ]
    }
  ]
};
```

If you want some of properties to be treated equally in order you can group them into arrays, like so:

```js
order: [
  ['controller', 'service', 'query-params'],
  'inherited-property',
  'property',
  ['single-line-function', 'multi-line-function']
];
```

### Custom Properties

If you would like to specify ordering for a property type that is not listed, you can use the custom property syntax `custom:myPropertyName` in the order list to specify where the property should go.

### Additional Properties

You can find the full list of properties [here](/lib/utils/property-order.js#L10).

## Description

You should write code grouped and ordered in this way:

1. Controller injections
2. Service injections
3. Query params
4. Default controller's properties
5. Custom properties
6. Single line computed properties
7. Multi line computed properties
8. Observers
9. Actions
10. Custom / private methods

## Examples

```javascript
const {
  Controller,
  computed,
  inject: { controller, service },
  get
} = Ember;

export default Controller.extend({
  // 1. Controller injections
  application: controller(),

  // 2. Service injections
  currentUser: service(),

  // 3. Query params
  queryParams: ['view'],

  // 4. Default controller's properties
  concatenatedProperties: ['concatenatedProperty'],

  // 5. Custom properties
  attitude: 10,

  // 6. Single line Computed Property
  health: alias('model.health'),

  // 7. Multiline Computed Property
  levelOfHappiness: computed('attitude', 'health', function() {
    return get(this, 'attitude') * get(this, 'health') * Math.random();
  }),

  // 8. Observers
  onVehicleChange: observer('vehicle', function() {
    // observer logic
  }),

  // 9. All actions
  actions: {
    sneakyAction() {
      return this._secretMethod();
    }
  },

  // 10. Custom / private methods
  _secretMethod() {
    // custom secret method logic
  }
});
```

## Help Wanted

| Issue | Link |
| :-- | :-- |
| :x: Missing native JavaScript class support | [#560](https://github.com/ember-cli/eslint-plugin-ember/issues/560) |
