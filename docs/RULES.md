## Table of contents:
* [General](#general)
	* [`local-modules`](#local-modules)
	* [`jquery-ember-run`](#jquery-ember-run)
	* [`no-observers`](#no-observers)
	* [`no-side-effect`](#no-side-effect)
	* [`named-functions-in-promises`](#named-functions-in-promises)
	* [`no-function-prototype-extensions`](#no-function-prototype-extensions)
	* [`use-ember-get-and-set`](#use-ember-get-and-set)
	* [`use-brace-expansion`](#use-brace-expansion)
* [Organizing](#organizing)
	* [`order-in-components`](#order-in-components)
	* [`order-in-models`](#order-in-models)
	* [`order-in-routes`](#order-in-routes)
	* [`order-in-controllers`](#order-in-controllers)
* [Controllers](#controllers)
	* [`alias-model-in-controller`](#alias-model-in-controller)
	* [`query-params-on-top`](#query-params-on-top)
* [Components](#components)
	* [`closure-actions`](#closure-actions)
	* [`no-on-calls-in-components`](#no-on-calls-in-components)
	* [`avoid-leaking-state-in-components`](#avoid-leaking-state-in-components)
* [Ember Data](#ember-data)
	* [`no-empty-attrs`](#no-empty-attrs)
* [Routing](#routing)
	* [`routes-segments-snake-case`](#routes-segments-snake-case)

## General

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

### Don’t use jQuery without Ember Run Loop
#### `jquery-ember-run`
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


### Don't use observers
#### `no-observers`
Usage of observers is very easy **BUT** it leads to hard to reason about consequences. Unless observers are necessary, it's better to avoid them.
```hbs
{{input value=text key-up="change"}}
```

```javascript
// GOOD
export default Controller.extend({
  actions: {
    change() {
      console.log(`change detected: ${this.get('text')}`);
    },
  },
});

// BAD
export default Model.extend({
  change: Ember.observer('text', function() {
    console.log(`change detected: ${this.get('text')}`);
  },
});
```

### Don't introduce side-effects in computed properties
#### `no-side-effect`
When using computed properties do not introduce side effects. It will make reasoning about the origin of the change much harder.

```js
import Ember from 'ember';

const {
  Component,
  computed: { filterBy, alias },
} = Ember;

export default Component.extend({
  users: [
    { name: 'Foo', age: 15 },
    { name: 'Bar', age: 16 },
    { name: 'Baz', age: 15 }
  ],

  // GOOD:
  fifteen: filterBy('users', 'age', 15),
  fifteenAmount: alias('fifteen.length'),

  // BAD:
  fifteenAmount: 0,
  fifteen: computed('users', function() {
    const fifteen = this.get('users').filterBy('items', 'age', 15);
    this.set('fifteenAmount', fifteen.length); // SIDE EFFECT!
    return fifteen;
  })
});
```

### Use named functions defined on objects to handle promises
#### `named-functions-in-promises`
When you use promises and its handlers, use named functions defined on parent object. Thus, you will be able to test them in isolation using unit tests without any additional mocking.

```js
export default Component.extend({
  actions: {
    // BAD
    updateUser(user) {
      user.save().then(() => {
        return user.reload();
      }).then(() => {
        this.notifyAboutSuccess();
      }).catch(() => {
        this.notifyAboutFailure();
      });
    },
    // GOOD
    updateUser(user) {
      user.save()
        .then(this._reloadUser.bind(this))
        .then(this._notifyAboutSuccess.bind(this))
        .catch(this._notifyAboutFailure.bind(this));
    },
  },
  _reloadUser(user) {
    return user.reload();
  },
  _notifyAboutSuccess() {
    // ...
  },
  _notifyAboutFailure() {
    // ...
  },
});
```

And then you can make simple unit tests for handlers:
```
test('it reloads user in promise handler', function(assert) {
  const component = this.subject();
  // assuming that you have `user` defined with kind of sinon spy on its reload method
  component._reloadUser(user);
  assert.ok(userReloadSpy.calledOnce, 'user#reload should be called once');
});
```

### Do not use Ember's `function` prototype extensions
#### `no-function-prototype-extensions`
Use computed property syntax, observer syntax or module hooks instead of `.property()`, `.observe()` or `.on()` in Ember modules.
```js
export default Component.extend({
    // BAD
    abc: function() { /* custom logic */ }.property('xyz'),
    def: function() { /* custom logic */ }.observe('xyz'),
    ghi: function() { /* custom logic */ }.on('didInsertElement'),

    // GOOD
    abc: computed('xyz', function() { /* custom logic */ }),
    def: observer('xyz', function() { /* custom logic */ }),
    didInsertElement() { /* custom logic */ }
});
```

### Use `Ember.get` and `Ember.set`
#### `use-ember-get-and-set`
This way you don't have to worry whether the object that you're trying to access is an `Ember.Object` or not. It also solves the problem of trying to wrap every object in `Ember.Object` in order to be able to use things like `getWithDefault`.
```javascript
// Bad
this.get('fooProperty');
this.set('fooProperty', 'bar');
this.getWithDefault('fooProperty', 'defaultProp');
object.get('fooProperty');
object.getProperties('foo', 'bar');
object.setProperties({ foo: 'bar', baz: 'qux' });

// Good

const {
  get,
  set,
  getWithDefault,
  getProperties,
  setProperties
} = Ember;
// ...
get(this, 'fooProperty');
set(this, 'fooProperty', 'bar');
getWithDefault(this, 'fooProperty', 'defaultProp');
get(object, 'fooProperty');
getProperties(object, 'foo', 'bar');
setProperties(object, { foo: 'bar', baz: 'qux' });
```

### Use brace expansion
#### `use-brace-expansion`
This allows much less redundancy and is easier to read.

Note that **the dependent keys must be together (without space)** for the brace expansion to work.

```
// Good
fullName: computed('user.{firstName,lastName}', {
  // Code
})

// Bad
fullName: computed('user.firstName', 'user.lastName', {
  // Code
})
```

## Organizing

### Organize your components
#### `order-in-components`
You should write code grouped and ordered in this way:

1. Services
2. Default values
3. Single line computed properties
4. Multiline computed properties
5. Observers
6. Lifecycle Hooks
7. Actions
8. Custom / private methods

```javascript
const { Component, computed, inject: { service } } = Ember;
const { alias } = computed;

export default Component.extend({
  // 1. Services
  i18n: service(),

  // 2. Defaults
  role: 'sloth',

  // 3. Single line Computed Property
  vehicle: alias('car'),

  // 4. Multiline Computed Property
  levelOfHappiness: computed('attitude', 'health', function() {
    const result = this.get('attitude') * this.get('health') * Math.random();
    return result;
  }),

  // 5. Observers
  onVahicleChange: observer('vehicle', function() {
    // observer logic
  }),

  // 6. Lifecycle Hooks
  init() {
    // custom init logic
  },

  didInsertElement() {
    // custom didInsertElement logic
  },

  // 7. All actions
  actions: {
    sneakyAction() {
      return this._secretMethod();
    }
  },

  // 8. Custom / private methods
  _secretMethod() {
    // custom secret method logic
  }
});
```

### Organize your models
#### `order-in-models`
You should write code grouped and ordered in this way:

1. Attributes
2. Relations
3. Single line computed properties
4. Multiline computed properties
5. Other structures (custom methods etc.)

```javascript
// GOOD
export default Model.extend({
  // 1. Attributes
  shape: attr('string'),

  // 2. Relations
  behaviors: hasMany('behaviour'),

  // 3. Computed Properties
  mood: computed('health', 'hunger', function() {
    const result = this.get('health') * this.get('hunger');
    return result;
  })
});

// BAD
export default Model.extend({
  mood: computed('health', 'hunger', function() {
    const result = this.get('health') * this.get('hunger');
    return result;
  }),

  hat: attr('string'),

  behaviors: hasMany('behaviour'),

  shape: attr('string')
});
```

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

### Organize your controllers
#### `order-in-controllers`
You should write code grouped and ordered in this way:

1. Services
2. Default controller's properties
3. Custom properties
4. Single line computed properties
5. Multi line computed properties
6. Observers
7. Actions
8. Custom / private methods


```javascript
const { Controller, computed, inject: { service }, get } = Ember;

export default Controller.extend({
  // 1. Services
  currentUser: service(),

  // 2. Default route's properties
  queryParams: ['view'],

  // 3. Custom properties
  attitude: 10,

  // 4. Single line Computed Property
  health: alias('model.health'),

  // 5. Multiline Computed Property
  levelOfHappiness: computed('attitude', 'health', function() {
    return get(this, 'attitude') * get(this, 'health') * Math.random();
  }),

  // 6. Observers
  onVahicleChange: observer('vehicle', function() {
    // observer logic
  }),

  // 7. All actions
  actions: {
    sneakyAction() {
      return this._secretMethod();
    },
  },

  // 8. Custom / private methods
  _secretMethod() {
    // custom secret method logic
  },
});
```

## Controllers

### Alias your model
#### `alias-model-in-controller`
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

## Ember Data

### Be explicit with Ember data attribute types
#### `no-empty-attrs`
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


## Components
### Closure Actions
#### `closure-actions`
Always use closure actions (according to DDAU convention). Exception: only when you need bubbling.

```javascript
export default Controller.extend({
  actions: {
    detonate() {
      alert('Kabooom');
    }
  }
});
```

```hbs
{{! GOOD }}
{{pretty-component boom=(action 'detonate')}}
```

```javascript
export default Component.extend({
  actions: {
    pushLever() {
      this.attr.boom();
    }
  }
})
```

```hbs
{{! BAD }}
{{awful-component detonate='detonate'}}
```
```javascript
export default Component.extend({
  actions: {
    pushLever() {
      this.sendAction('detonate');
    }
  }
})
```
### Don't use `.on()` calls as components values
#### `no-on-calls-in-components`
Prevents using `.on()` in favour of component's lifecycle hooks.
```js
export default Component.extend({
  // BAD
  abc: on('didInsertElement', function () { /* custom logic */ }),

  // GOOD
  didInsertElement() { /* custom logic */ }
});
```
### Avoid leaking state
#### `avoid-leaking-state-in-components`

*Example config:*
```netguru-ember/avoid-leaking-state-in-components: [1, ['array', 'of', 'ignored', 'properties']]```

Don't use arrays and objects as default properties. More info here: https://dockyard.com/blog/2015/09/18/ember-best-practices-avoid-leaking-state-into-factories


```
// BAD
export default Ember.Component.extend({
  items: [],

  actions: {
    addItem(item) {
      this.get('items').pushObject(item);
    },
  },
});
```

```
// Good
export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.items = [];
  },

  actions: {
    addItem(item) {
      this.get('items').pushObject(item);
    },
  },
});
```

## Routing

### Route naming
#### `routes-segments-snake-case`
Dynamic segments in routes should use _snake case_, so Ember doesn't have to do extra serialization in order to resolve promises.

```javascript
// GOOD
this.route('tree', { path: ':tree_id'});

// BAD
this.route('tree', { path: ':treeId'});
```
