# ember/no-implicit-injections

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Ember 3.26 introduced a deprecation for relying on implicit service injections or allowing addons to implicitly inject services into all classes of certain types. Support for this is dropped in Ember 4.0.

In many applications, `this.store` from Ember Data is often used without injecting the `store` service in Controllers or Routes. Other addons may also have included implicit service injections via initializers and the `application.inject` API.

To resolve this deprecation, a service should be explicitly declared and injected using the [service injection decorator](https://api.emberjs.com/ember/3.28/functions/@ember%2Fservice/inject).

## Rule Details

This rule checks for a configured list of previously auto injected services and warns if they are used in classes without explicit injected service properties.

## Examples

Examples of **incorrect** code for this rule:

```js
// routes/index.js
import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
  async model() {
    return this.store.findAll('rental');
  }
}

```

```js
// controllers/index.js
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class IndexController extends Controller {
  @action
  async loadUsers() {
    return this.store.findAll('user');
  }
}
```

Examples of **correct** code for this rule:

```js
// routes/index.js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service('store') store;

  async model() {
    return this.store.findAll('rental');
  }
}
```

```js
// controller/index.js
import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class IndexController extends Controller {
  @service('store') store;

  @action
  async loadUsers() {
    return this.store.findAll('user');
  }
}
```

## Migration

The autofixer for this rule will update classes and add injections for the configured services.

## Configuration

This lint rule will search for instances of `store` used in routes or controllers by default. If you have other services that you would like to check for uses of, the configuration can be overridden.

- object -- containing the following properties:
  - array -- `services` -- Array of configuration objects configuring the lint rule to check for use of implicit injected services
    - string -- `serviceName` -- The name of the service that is implicitly injected
    - array -- `moduleNames` -- Array of string listing the types of classes (controller, route, component, etc) to check for implicit injections. If an array is declared only those class types will be checked for implicit injection. (Defaults to checking all class files/types)

Example config:

```js
module.exports = {
  rules: {
    'ember/no-implicit-injections': [2, {
      services: [
        // Ember Responsive Used to Auto Inject the media service in Components/Controllers
        { serviceName: 'media', moduleNames: ['Component', 'Controller'] },
        // Ember CLI Flash Used to Auto Inject the flashMessages service in all modules
        { serviceName: 'flashMessages' },
      ]
    }]
  }
}
```

## Related Rules

- [no-unnecessary-service-injection-argument](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-unnecessary-service-injection-argument.md) omit service injection argument if possible
- [no-implicit-service-injection-argument](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-unnecessary-service-injection-argument.md) require the service injection argument for all services (fix output for this rule follows this pattern)

## References

- [Deprecation](https://deprecations.emberjs.com/v3.x/#toc_implicit-injections)
