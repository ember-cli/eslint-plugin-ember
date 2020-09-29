# no-test-support-import

No importing of test support files into non-test code..

**TL;DR** Do not import from a file located in addon-test-support into non-test code. Doing so will result in production errors that are not capable of being caught in tests as require statements are available in tests but not on production builds.

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

This is meant as an addition to the [no-test-import-export](no-test-import-export.md) rule as these files do represent test files but are located in addon-test-support rather than in `/tests/`.

## Related Rules

* [no-test-import-export](no-test-import-export.md)
