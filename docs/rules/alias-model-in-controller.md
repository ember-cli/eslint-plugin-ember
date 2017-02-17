## Alias your model

### Rule name: `alias-model-in-controller`

It makes code more readable if model has the same name as a subject. It’s more maintainable, and will conform to future  routable components. We can do this in two ways:

- set alias to model (in case when there is a `Nail Controller`):
```javascript
const { alias } = Ember.computed;
export default Ember.Controller.extend({
  nail: alias('model'),
});
```

- set it in `setupController` method:
```javascript
export default Ember.Route.extend({
  setupController(controller, model) {
    controller.set('nail', model);
  },
});
