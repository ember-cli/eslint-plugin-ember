### Create local version of Ember.* and DS.*

#### `local-modules`

Ember can use new functionality of ES6 - `modules`. In the near future, Ember will use this convention and eventually we will have to import `computed` instead of `Ember.computed`. To make code more clear and ready for the future, we should create local versions of these modules.
```javascript
import Ember from 'ember';
import DS from 'ember-data';

// GOOD
const { Model, attr } = DS;
const { computed } = Ember;
const { alias } = computed;

export default Model.extend({
  name: attr('string'),
  degree: attr('string'),
  title: alias('degree'),

  fullName: computed('name', 'degree', function() {
    return `${this.get('degree')} ${this.get('name')}`;
  }),
});

// BAD
export default DS.Model.extend({
  name: DS.attr('string'),
  degree: DS.attr('string'),
  title: Ember.computed.alias('degree'),

  fullName: Ember.computed('name', 'degree', function() {
    return `${this.get('degree')} ${this.get('name')}`;
  }),
});
```
