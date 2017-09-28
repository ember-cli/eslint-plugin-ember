## Use "New Module Imports" from Ember RFC #176

### Rule name: `new-module-imports`

[RFC #176](https://github.com/emberjs/rfcs/pull/176) introduced as new public
API for Ember.js based on ES6 module imports.

If you use `ember-cli-babel` with version `6.6.0` or above you can start using
the "New Module Imports" instead of the `Ember` global directly. This will
enable us to build better tree shaking feature into Ember CLI.

If you want to transition to new module imports in old Ember app use dedicated [codemod](https://github.com/ember-cli/ember-modules-codemod). For more informations please read [the following article](https://medium.com/@Dhaulagiri/embers-javascript-modules-api-b4483782f329) by Brian Runnells.

```javascript
// GOOD
import Component from '@ember/component'
import EmberObject, { computed } from '@ember/object'
import Service, { inject } from '@ember/service'

// BAD
Ember.Component.extend({});
Ember.Object.extend({});
Ember.computed(function() {});
Ember.inject.service('foo');
```
