# no-controllers

Some people may prefer to avoid the use of controllers in their applications, typically in favor of components which can be more portable and easier to test.

This rule disallows controller usage, except when the controller is used to define `queryParams` (a feature currently only available in controllers).

Note: this rule will not be added to the `recommended` configuration until controller usage has become less common / deprecated.

## Examples

Examples of **incorrect** code for this rule:

```js
import Controller from '@ember/controller';

export default class ArticlesController extends Controller {
  // Controller disallowed since it doesn't use `queryParams`.
  // ...
}
```

Examples of **correct** code for this rule:

```js
import Controller from '@ember/controller';

export default class ArticlesController extends Controller {
  queryParams = ['category']; // Controller allowed for defining `queryParams`.
  @tracked category = null;
  // ...
}
```

## Further Reading

- [Guide on controllers](https://guides.emberjs.com/release/routing/controllers/)
- [Guide on `queryParameters`](https://guides.emberjs.com/release/routing/query-params/)
