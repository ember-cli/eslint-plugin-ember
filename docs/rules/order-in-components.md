## Organize your components

### Rule name: `order-in-components`

#### Configuration

```
ember/order-in-components: [2, {
  order: [
    'service',
    'property',
    'single-line-function',
    'multi-line-function',
    'observer',
    'lifecycle-hook',
    'actions',
    ['method', 'empty-method'],
  ]
}]
```

If you want some of properties to be treated equally in order you can group them into arrays, like so:

```
order: [
  'service',
  'property',
  ['single-line-function', 'multi-line-function'],
  'observer',
  'lifecycle-hook',
  'actions',
  ['method', 'empty-method'],
]
```

You can find full list of properties that you can use to configure this rule [here](/lib/utils/property-order.js#L10).

#### Description

You should write code grouped and ordered in this way:

1. Services
2. Default values
3. Single line computed properties
4. Multiline computed properties
5. Observers
6. Lifecycle Hooks
7. Actions
8. Custom / private methods

```javascript
const { Component, computed, inject: { service } } = Ember;
const { alias } = computed;

export default Component.extend({
  // 1. Services
  i18n: service(),

  // 2. Defaults
  role: 'sloth',

  // 3. Single line Computed Property
  vehicle: alias('car'),

  // 4. Multiline Computed Property
  levelOfHappiness: computed('attitude', 'health', function() {
    const result = this.get('attitude') * this.get('health') * Math.random();
    return result;
  }),

  // 5. Observers
  onVahicleChange: observer('vehicle', function() {
    // observer logic
  }),

  // 6. Lifecycle Hooks
  init() {
    // custom init logic
  },

  didInsertElement() {
    // custom didInsertElement logic
  },

  // 7. All actions
  actions: {
    sneakyAction() {
      return this._secretMethod();
    }
  },

  // 8. Custom / private methods
  _secretMethod() {
    // custom secret method logic
  }
});
```
