### Organize your controllers

#### `order-in-controllers`

You should write code grouped and ordered in this way:

1. Services
2. Default controller's properties
3. Custom properties
4. Single line computed properties
5. Multi line computed properties
6. Observers
7. Actions
8. Custom / private methods


```javascript
const { Controller, computed, inject: { service }, get } = Ember;

export default Controller.extend({
  // 1. Services
  currentUser: service(),

  // 2. Default route's properties
  queryParams: ['view'],

  // 3. Custom properties
  attitude: 10,

  // 4. Single line Computed Property
  health: alias('model.health'),

  // 5. Multiline Computed Property
  levelOfHappiness: computed('attitude', 'health', function() {
    return get(this, 'attitude') * get(this, 'health') * Math.random();
  }),

  // 6. Observers
  onVahicleChange: observer('vehicle', function() {
    // observer logic
  }),

  // 7. All actions
  actions: {
    sneakyAction() {
      return this._secretMethod();
    },
  },

  // 8. Custom / private methods
  _secretMethod() {
    // custom secret method logic
  },
});
```
