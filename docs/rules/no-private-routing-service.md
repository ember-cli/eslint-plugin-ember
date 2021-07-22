# no-private-routing-service

✅ The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

Disallow the use of:

* The private `-routing` service
* The private `_routerMicrolib` property
* The private `router:main` property

There has been a public `router` service since Ember 2.16 and using the private routing service should be unnecessary.

## Examples

Examples of **incorrect** code for this rule:

```js
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  routing: service('-routing')
});
```

```js
import Component from '@ember/component';

export default class MyComponent extends Component {
  @service('-routing') routing;
}
```

```js
// When `catchRouterMicrolib` option is enabled.

import Component from '@ember/component';

export default class MyComponent extends Component {
  @service('router') router;

  get someMethod() {
    return this.router._routerMicrolib.activeTransition;
  }
}
```

```js
// When `catchRouterMain` option is enabled.

import Component from '@ember/component';
import { getOwner } from '@ember/application';

export default class MyComponent extends Component {
  someFunction() {
    const router = getOwner(this).lookup('router:main');
    // ...
  }
}
```

Examples of **correct** code for this rule:

```js
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  router: service('router')
});
```

```js
import Component from '@ember/component';

export default class MyComponent extends Component {
  @service
  router;
}
```

## Configuration

This rule takes an optional object containing:

* `boolean` -- `catchRouterMicrolib` -- whether the rule should catch usages of the private property `_routerMicrolib` (default `true`)
* `boolean` -- `catchRouterMain` -- whether the rule should catch usages of the private property `router:main` (default `true`)

## References

[Router RFC](https://github.com/emberjs/rfcs/blob/master/text/0095-router-service.md)
