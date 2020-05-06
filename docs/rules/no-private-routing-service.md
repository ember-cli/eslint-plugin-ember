# no-private-routing-service

:white_check_mark: The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

Disallow the use of:

* The private `-routing` service
* The private `_routerMicrolib` property (when the `catchRouterMicrolib` option is enabled)

There has been a public `router` service since Ember 2.16 and using the private routing service should be unnecessary.

## Examples

Examples of **incorrect** code for this rule:

```javascript
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  routing: service('-routing')
});
```

```javascript
import Component from '@ember/component';

export default class MyComponent extends Component {
  @service('-routing') routing;
}
```

```javascript
// When `catchRouterMicrolib` option is enabled.

import Component from '@ember/component';

export default class MyComponent extends Component {
  @service('router') router;

  get someMethod() {
    return this.router._routerMicrolib.activeTransition;
  }
}
```

Examples of **correct** code for this rule:

```javascript
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  router: service('router')
});
```

```javascript
import Component from '@ember/component';

export default class MyComponent extends Component {
  @service
  router;
}
```

## Configuration

This rule takes an optional object containing:

* `boolean` -- `catchRouterMicrolib` -- whether the rule should catch usages of the private property `_routerMicrolib` (default `false`) (TODO: enable this by default in the next major release)

## References

[Router RFC](https://github.com/emberjs/rfcs/blob/master/text/0095-router-service.md)
