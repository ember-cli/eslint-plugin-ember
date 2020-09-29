# no-test-support-import

:white_check_mark: The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

No importing of test files.

**TL;DR** Do not import from a file located in addon-test-support into production code. Doing so will result in production errors that are not capable of being caught in tests as require statements are available in tests but not on production builds.

## Examples

Examples of **incorrect** code for this rule:

> app/routes/index.js

```javascript
import doSomething from '../test-support/some-other-test';

import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class SomeRouteRoute extends Route {
  // …
  model() {
    return doSomething();
  }
}
```

Examples of **correct** code for this rule:

> tests/unit/foo-test.js

```javascript
import setupModule from '../test-support/setup-module';
import { module, test } from 'qunit';

module('Acceptance | module', setupModule());
```

> addon-test-support/setupApplication.js

```javascript
import setupModule from '../test-support/setup-module';

export default function setupApplicationTest(hooks) {
  setupModule(hooks);
  // ...
}
```
