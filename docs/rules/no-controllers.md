# no-controllers

Some people may prefer to avoid the use of controllers in their applications, typically in favor of components which can be more portable and easier to test.

This rule disallows controller usage, except when the controller is used to define `queryParams`.

## Examples

Examples of **incorrect** code for this rule:

```js
import Controller from '@ember/controller';
export default class ArticlesController extends Controller {
  // Controller disallowed since it doesn't use `queryParams`.
  ...
}
```

Examples of **correct** code for this rule:

```js
import Controller from '@ember/controller';
export default class ArticlesController extends Controller {
  queryParams = ['category']; // Controller allowed for defining `queryParams`.
  @tracked category = null;
  ...
}
```

Note that this rule supports both classic and native class syntax.

## Further Reading

- [Guide on controllers](https://guides.emberjs.com/release/routing/controllers/)
- [Guide on `queryParameters`](https://guides.emberjs.com/release/routing/query-params/)
