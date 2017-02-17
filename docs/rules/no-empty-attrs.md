## Be explicit with Ember data attribute types

### Rule name: `no-empty-attrs`

Ember Data could handle lack of specified types in model description. Nonetheless this could lead to ambiguity. Therefore always supply proper attribute type to ensure the right data transform is used.

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
