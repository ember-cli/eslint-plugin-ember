# computed-property-getters

Enforce the consistent use of getters in computed properties.

Computed properties may be created with or without a `get` method. This rule ensures that the choice
is consistent.

## Configuration

This rule takes a single string option.

String option:

- `"always-with-setter"` (default) getters are *required* when computed property has a setter
- `"always"` getters are *required* in computed properties
- `"never"`  getters are *never allowed* in computed properties

## Examples

### always-with-setter

```js
import EmberObject, { computed } from '@ember/object';

// BAD
EmberObject.extend({
  fullName: computed('firstName', 'lastName', {
    get() {
      // ...
    }
  })
});

// GOOD
EmberObject.extend({
  fullName: computed('firstName', 'lastName', function () {
    // ...
  })
});

// GOOD
EmberObject.extend({
  fullName: computed('firstName', 'lastName', {
    set() {
      // ...
    },
    get() {
      // ...
    }
  })
});
```

### always

```js
import EmberObject, { computed } from '@ember/object';

// GOOD
EmberObject.extend({
  fullName: computed('firstName', 'lastName', {
    get() {
      // ...
    }
  })
});

// BAD
EmberObject.extend({
  fullName: computed('firstName', 'lastName', function () {
    // ...
  })
});
```

### never

```js
import EmberObject, { computed } from '@ember/object';

// GOOD
EmberObject.extend({
  fullName: computed('firstName', 'lastName', function () {
    // ...
  })
});

// BAD
EmberObject.extend({
  fullName: computed('firstName', 'lastName', {
    get() {
      // ...
    }
  })
});

// BAD
EmberObject.extend({
  fullName: computed('firstName', 'lastName', {
    get() {
      // ...
    },
    set() {
      // ...
    }
  })
});
```

## Help Wanted

| Issue | Link |
| :-- | :-- |
| ❌ Missing native JavaScript class support | [#560](https://github.com/ember-cli/eslint-plugin-ember/issues/560) |
