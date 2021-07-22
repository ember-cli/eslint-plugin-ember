# no-controller-access-in-routes

✅ The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

Accessing the controller in a route outside of `setupController`/`resetController` hooks (where it is passed as an argument) is discouraged.

If access is required regardless, `controllerFor` must be used to assert the controller isn't undefined as it is not guaranteed to be eagerly loaded (for optimization purposes).

## Rule Details

This rule disallows routes from accessing the controller outside of `setupController`/`resetController`.

## Examples

Examples of **incorrect** code for this rule:

```js
import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class MyRoute extends Route {
  @action
  myAction() {
    const controller = this.controller;
  }
}
```

```js
import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class MyRoute extends Route {
  @action
  myAction() {
    const controller = this.controllerFor('my');
  }
}
```

Examples of **correct** code for this rule:

```js
import Route from '@ember/routing/route';

export default class MyRoute extends Route {
  setupController(controller, ...args) {
    super.setupController(controller, ...args);
    const foo = controller.foo;
  }
}
```

```js
import Route from '@ember/routing/route';

export default class MyRoute extends Route {
  resetController(controller, ...args) {
    super.resetController(controller, ...args);
    const foo = controller.foo;
  }
}
```

## Configuration

* object -- containing the following properties:
  * boolean -- `allowControllerFor` -- wheter the rule should allow or disallow routes from accessing the controller outside of setupController/resetController via `controllerFor` (default: `false`)
