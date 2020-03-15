# alias-model-in-controller

It makes code more readable if the model has the same name as a subject.

## Examples

We can do this in two ways:

- Alias the model to another property name in the Controller:

  ```javascript
  import Controller from '@ember/controller';
  import { alias } from '@ember/object/computed';

  export default Controller.extend({
    nail: alias('model')
  });
  ```

- Set it as a property in the Route's `setupController` method:

  ```javascript
  import Route from '@ember/routing/route';

  export default Route.extend({
    setupController(controller, model) {
      controller.set('nail', model);
    }
  });
  ```

If you're passing [multiple models](https://guides.emberjs.com/v2.13.0/routing/specifying-a-routes-model/#toc_multiple-models) as an [`RSVP.hash`](https://emberjs.com/api/classes/RSVP.html#method_hash), you can also alias nested properties:

```javascript
import Controller from '@ember/controller';
import { reads } from '@ember/object/computed';

export default Controller.extend({
  people: reads('model.people'),
  pets: reads('model.pets')
});
```

## Help Wanted

| Issue | Link |
| :-- | :-- |
| :x: Missing native JavaScript class support | [#560](https://github.com/ember-cli/eslint-plugin-ember/issues/560) |
