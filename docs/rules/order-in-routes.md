### Organize your routes

#### `order-in-routes`

You should write code grouped and ordered in this way:

1. Services
2. Default route's properties
3. Custom properties
4. model() hook
5. Other route's methods (beforeModel etc.)
6. Actions
7. Custom / private methods

```javascript
const { Route, inject: { service }, get } = Ember;

export default Route.extend({
  // 1. Services
  currentUser: service(),

  // 2. Default route's properties
  queryParams: {
    sortBy: { refreshModel: true },
  },

  // 3. Custom properties
  customProp: 'test',

  // 4. Model hook
  model() {
    return this.store.findAll('article');
  },

  // 5. Other route's methods
  beforeModel() {
    if (!get(this, 'currentUser.isAdmin')) {
      this.transitionTo('index');
    }
  },

  // 6. All actions
  actions: {
    sneakyAction() {
      return this._secretMethod();
    },
  },

  // 7. Custom / private methods
  _secretMethod() {
    // custom secret method logic
  },
});
```
