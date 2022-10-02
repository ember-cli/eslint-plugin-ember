# no-invalid-test-waiters

✅ The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

Prevents invalid usage of test waiters.

## Rule Details

The new test waiters APIs, found in the [ember-test-waiters](https://github.com/emberjs/ember-test-waiters) addon, have recommended best practices that ensure you are successful with their usage. This rule ensures that all usages are adhering to recommended best practices:

- Used in module scope
- Assigned to a variable

## Examples

Examples of **incorrect** code for this rule:

```js
import { buildWaiter } from 'ember-test-waiters';

function useWaiter() {
  const myOtherWaiter = buildWaiter('the second'); // inside function
}
```

```js
import { buildWaiter } from 'ember-test-waiters';

buildWaiter('the second'); // not stored in variable
```

Examples of **correct** code for this rule:

```js
import { buildWaiter } from 'ember-test-waiters';

const myWaiter = buildWaiter('waiterName');
```

## References

For more information on the new test waiters API, please visit [ember-test-waiters](https://github.com/emberjs/ember-test-waiters).
