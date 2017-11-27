## Organize your components

### Rule name: `order-in-components`

#### Configuration

```
ember/order-in-components: [2, {
  order: [
    'service',
    'property',
    'empty-method',
    'single-line-function',
    'multi-line-function',
    'observer',
    'init',
    'didReceiveAttrs',
    'willRender',
    'didInsertElement',
    'didRender',
    'didUpdateAttrs',
    'willUpdate',
    'didUpdate',
    'willDestroyElement',
    'willClearRender',
    'didDestroyElement',
    'actions',
    'method',
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
  'init',
  'didReceiveAttrs',
  'willRender',
  'didInsertElement',
  'didRender',
  'didUpdateAttrs',
  'willUpdate',
  'didUpdate',
  'willDestroyElement',
  'willClearRender',
  'didDestroyElement',
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
6. Lifecycle Hooks (in execution order)
7. Actions
8. Custom / private methods

```javascript
const { Component, computed, inject: { service } } = Ember;
const { alias } = computed;

export default Component.extend({
  // 1. Services
  i18n: service(),

  // 2. Properties
  role: 'sloth',

  // 3. Empty methods
  onRoleChange() {},

  // 4. Single line Computed Property
  vehicle: alias('car'),

  // 5. Multiline Computed Property
  levelOfHappiness: computed('attitude', 'health', function() {
    const result = this.get('attitude') * this.get('health') * Math.random();
    return result;
  }),

  // 6. Observers
  onVehicleChange: observer('vehicle', function() {
    // observer logic
  }),

  // 7. Lifecycle Hooks
  init() {
    // custom init logic
  },

  didInsertElement() {
    // custom didInsertElement logic
  },

  willDestroyElement() {
    // custom willDestroyElement logic
  },

  // 8. All actions
  actions: {
    sneakyAction() {
      return this._secretMethod();
    }
  },

  // 9. Custom / private methods
  _secretMethod() {
    // custom secret method logic
  }
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
export default Component.extend({
  regularProp: 1,
  aMethod: function() {},
  customOrderedPropName: 2
});
```
