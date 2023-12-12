# ember/no-private-routing-service

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Disallow the use of:

- The private `-routing` service
- The private `_routerMicrolib` property
- The private `router:main` property

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

<!-- begin auto-generated rule options list -->

| Name                  | Description                                                                     | Type    | Default |
| :-------------------- | :------------------------------------------------------------------------------ | :------ | :------ |
| `catchRouterMain`     | Whether the rule should catch usages of the private property `router:main`.     | Boolean | `true`  |
| `catchRouterMicrolib` | Whether the rule should catch usages of the private property `_routerMicrolib`. | Boolean | `true`  |

<!-- end auto-generated rule options list -->

## References

[Router RFC](https://github.com/emberjs/rfcs/blob/master/text/0095-router-service.md)
