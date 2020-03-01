# no-actions-hash

Disallows the actions hash in components and controllers.

Ember Octane includes a rethink of event handling in Ember. The `actions` hash and `{{action}}` modifier and helper are no longer needed. To provide the correct context to functions (binding), you should now use the `@action` decorator. In templates, the `{{on}}` modifier can be used to set up event handlers and the `{{fn}}` helper can be used for partial application.

## Rule Detail

Use the `@action` decorator or `foo: action(function() {}))` syntax instead of an `actions` hash.

## Examples

Examples of **incorrect** code for this rule:

```js
// Bad, with classic class
import Component from '@ember/component';

export default Component.extend({
  actions: {
    foo() {}
  }
});
```

```js
// Bad, with native class
import Component from '@ember/component';

export class MyComponent extends Component {
  actions = {
    foo() {}
  };
}
```

Examples of **correct** code for this rule:

```js
// Good, with classic class
import Component from '@ember/component';
import { action } from '@ember/object';

export default Component.extend({
  foo: action(function() {})
});
```

```js
// Good, with native class
import Component from '@ember/component';
import { action } from '@ember/object';

export class MyComponent extends Component {
  @action
  foo() {}
}
```

## Further Reading

- [`{{on}}` Modifier RFC](https://github.com/emberjs/rfcs/pull/471)
- [`{{fn}}` Helper RFC](https://github.com/emberjs/rfcs/pull/470)
- [Ember Octane Update: What's up with `@action`?](https://www.pzuraq.com/ember-octane-update-action/)
