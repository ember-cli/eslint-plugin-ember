# no-private-routing-service

Disallow the use of the private `-routing` service.

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

## References

[Router RFC](https://github.com/emberjs/rfcs/blob/master/text/0095-router-service.md)
