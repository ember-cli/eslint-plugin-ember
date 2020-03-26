# no-invalid-test-waiters

Prevents invalid usage of test waiters.

## Rule Details

The new test waiters APIs, found in the [ember-test-waiters](https://github.com/emberjs/ember-test-waiters) addon, have recommended best practices that ensure you are successful with their usage. This rule ensures that all usages are adhering to recommended best practices.

## Examples

Examples of **incorrect** code for this rule:

```js
import { buildWaiter } from 'ember-test-waiters';

function useWaiter() {
  const myOtherWaiter = buildWaiter('the second');
}
```

```js
import { buildWaiter as b } from 'ember-test-waiters';

function useWaiter() {
  const myOtherWaiter = b('the second');
}
```

```js
import { buildWaiter } from 'ember-test-waiters';

const someFunction = () => {
  buildWaiter('waiterName');
};
```

Examples of **correct** code for this rule:

```js
import { buildWaiter } from 'ember-test-waiters';

const myWaiter = buildWaiter('waiterName');
```

```js
import { buildWaiter } from 'table-waiters';

function useWaiter() {
  const myOtherWaiter = buildWaiter('the second');
}
```

```js
import { buildWaiter } from 'ember-test-waiters';

function useWaiter() {
  const myWaiter = somethingElse.buildWaiter('waiterName');
}
```

```js
import { buildWaiter } from 'ember-test-waiters';

function useWaiter() {
  const myWaiter = buildWaiter.somethingElse('waiterName');
}
```

## References

For more information on the new test waiters API, please visit [ember-test-waiters](https://github.com/emberjs/ember-test-waiters).
