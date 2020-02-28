# computed-property-getters

Enforce the consistent use of getters in computed properties.

Computed properties may be created with or without a `get` method. This rule ensures that the choice
is consistent.

## Options

This rule takes a single string option.

String option:

* `"always-with-setter"` (default) getters are *required* when computed property has a setter
* `"always"` getters are *required* in computed properties
* `"never"`  getters are *never allowed* in computed properties

## Examples

### always-with-setter

```javascript
/// BAD
Ember.Object.extend({
    fullName: computed('firstName', 'lastName', {
        get() {
            //...
        }
    })
});

// GOOD
Ember.Object.extend({
    fullName: computed('firstName', 'lastName', function() {
        //...
    })
});

// GOOD
Ember.Object.extend({
    fullName: computed('firstName', 'lastName', {
        set() {
            //...
        },
        get() {
            //...
        }
    })
});
```

### always

```javascript
/// GOOD
Ember.Object.extend({
    fullName: computed('firstName', 'lastName', {
        get() {
            //...
        }
    })
});

// BAD
Ember.Object.extend({
    fullName: computed('firstName', 'lastName', function() {
        //...
    })
});
```

### never

```javascript
/// GOOD
Ember.Object.extend({
    fullName: computed('firstName', 'lastName', function() {
        //...
    })
});

// BAD
Ember.Object.extend({
    fullName: computed('firstName', 'lastName', {
        get() {
            //...
        }
    })
});

// BAD
Ember.Object.extend({
    fullName: computed('firstName', 'lastName', {
        get() {
            //...
        },
        set() {
            //...
        }
    })
});
```

## Help Wanted

| Issue | Link |
| :-- | :-- |
| :x: Missing native JavaScript class support | [#560](https://github.com/ember-cli/eslint-plugin-ember/issues/560) |
