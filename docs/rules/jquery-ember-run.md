# jquery-ember-run

Don’t use jQuery without the Ember Run Loop.

Using plain jQuery invokes actions out of the Ember Run Loop. In order to have a control on all operations in Ember, it's good practice to trigger actions in run loop.

## Examples

Examples of **incorrect** code for this rule:

```js
Ember.$('#something-rendered-by-jquery-plugin').on('click', () => {
  this._handlerActionFromController();
});
```

Examples of **correct** code for this rule:

```javascript
Ember.$('#something-rendered-by-jquery-plugin').on(
  'click',
  Ember.run.bind(this, this._handlerActionFromController)
);
```
