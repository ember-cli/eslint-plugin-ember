## Organize your controllers

### Rule name: `order-in-controllers`

#### Configuration

```
ember/order-in-controllers: [2, {
  order: [
    'service',
    'query-params',
    'inherited-property',
    'property',
    'single-line-function',
    'multi-line-function',
    'observer',
    'actions',
    'method',
  ]
}]
```

If you want some of properties to be treated equally in order you can group them into arrays, like so:

```
order: [
  ['service', 'query-params'],
  'inherited-property',
  'property',
  ['single-line-function', 'multi-line-function']
]
```

You can find full list of properties that you can use to configure this rule [here](/lib/utils/property-order.js#L10).

#### Description

You should write code grouped and ordered in this way:

1. Services
2. Query params
3. Default controller's properties
4. Custom properties
5. Single line computed properties
6. Multi line computed properties
7. Observers
8. Actions
9. Custom / private methods


```javascript
const { Controller, computed, inject: { service }, get } = Ember;

export default Controller.extend({
  // 1. Services
  currentUser: service(),

  // 2. Query params
  queryParams: ['view'],

  // 3. Default controller's properties
  attitude: 10,
  
  // 4. Custom properties
  ???

  // 5. Single line Computed Property
  health: alias('model.health'),

  // 6. Multiline Computed Property
  levelOfHappiness: computed('attitude', 'health', function() {
    return get(this, 'attitude') * get(this, 'health') * Math.random();
  }),

  // 7. Observers
  onVahicleChange: observer('vehicle', function() {
    // observer logic
  }),

  // 8. All actions
  actions: {
    sneakyAction() {
      return this._secretMethod();
    },
  },

  // 9. Custom / private methods
  _secretMethod() {
    // custom secret method logic
  },
});
```
