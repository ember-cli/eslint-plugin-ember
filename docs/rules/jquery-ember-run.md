## Don’t use jQuery without Ember Run Loop

### Rule name: `jquery-ember-run`

Using plain jQuery invokes actions out of the Ember Run Loop. In order to have a control on all operations in Ember it's good practice to trigger actions in run loop.

```javascript
/// GOOD
Ember.$('#something-rendered-by-jquery-plugin').on(
  'click',
  Ember.run.bind(this, this._handlerActionFromController)
);

// BAD
Ember.$('#something-rendered-by-jquery-plugin').on('click', () => {
  this._handlerActionFromController();
});
```
