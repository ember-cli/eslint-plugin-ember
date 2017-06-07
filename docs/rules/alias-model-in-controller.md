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
```

If you're passing
[multiple models](https://guides.emberjs.com/v2.13.0/routing/specifying-a-routes-model/#toc_multiple-models) as an
[`RSVP.hash`](https://emberjs.com/api/classes/RSVP.html#method_hash),
you can also alias nested properties:

```javascript
const { reads } = Ember.computed;
export default Ember.Controller.extend({
  people: reads('model.people'),
  pets:   reads('model.pets')
});
```
