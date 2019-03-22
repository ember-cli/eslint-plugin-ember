# Rule name: `computed-property-getters`

## Enforce the consistent use of getters in computed properties

Computed properties may be created with or without a `get` method. This rule ensures that the choice
is consistent.

## Options

This rule takes a single string option

String option:

* `"never"` (default) getters are *never allowed* in computed properties
* `"always"` getters are *required* in computed properties

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


