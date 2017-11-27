# order-in-controllers

## Configuration

```js
ember/order-in-controllers: [2, {
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
    ['method', 'empty-method'],
  ]
}]
```

If you want some of properties to be treated equally in order you can group them into arrays, like so:

```js
order: [
  ['controller', 'service', 'query-params'],
  'inherited-property',
  'property',
  ['single-line-function', 'multi-line-function']
]
```

You can find full list of properties that you can use to configure this rule [here](/lib/utils/property-order.js#L10).

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

```javascript
const { Controller, computed, inject: { controller, service }, get } = Ember;

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
    },
  },

  // 10. Custom / private methods
  _secretMethod() {
    // custom secret method logic
  },
});
```

#### Custom Prop Ordering

If you have certain properties that you like to keep in a particular order, then you can pass the `custom:$PROPERTY_NAME` syntax to the configuration:

```
ember/order-in-components: [2, {
  order: [
    'property',
    'method',
    ...
    'custom:customOrderedPropName'
  ]
}]
```

Now this accepted by the linter:

```
export default Controller.extend({
  regularProp: 1,
  aMethod: function() {},
  customOrderedPropName: 2
});
```
