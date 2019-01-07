## Be explicit with Ember data attribute types

### Rule name: `no-empty-attrs`

Ember Data handles not specifying a transform in model description. Nonetheless this could lead to ambiguity. This rule ensures that the right transform is specified for every attribute.

```javascript
const { Model, attr } = DS;

// GOOD
export default Model.extend({
  name: attr('string'),
  points: attr('number'),
  dob: attr('date'),
});

// BAD
export default Model.extend({
  name: attr(),
  points: attr(),
  dob: attr(),
});
```

In case when you need a custom behavior it's good to write own [Transform](http://emberjs.com/api/data/classes/DS.Transform.html)
