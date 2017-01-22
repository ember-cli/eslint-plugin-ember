### Query params should always be on top

#### `query-params-on-top`

If you are using query params in your controller, those should always be placed on top. It will make spotting them much easier.

```js
import Ember from 'ember';

const { Controller} = Ember;

// BAD
export default Controller.extend({
  statusOptions: Ember.String.w('Accepted Pending Rejected'),
  status: [],
  queryParams: ['status'],
});

// GOOD
export default Controller.extend({
  queryParams: ['status'],
  status: [],
  statusOptions: Ember.String.w('Accepted Pending Rejected'),
});
```
