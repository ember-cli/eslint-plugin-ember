# no-test-import-export

:white_check_mark: The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

No importing of test files.

**TL;DR** Do not import from a test file (a file ending in "-test.js") in another test file. Doing so will cause the module and tests from the imported file to be executed again. Similarly, test files should not have any exports.

Due to how qunit unloads a test module, importing a test file will cause any modules and tests within the file to be executed every time it gets loaded. If you want to import any helper functions or tests to be shared between multiple test files, please make it a test-helper that gets imported by the test file.

## Examples

Examples of **incorrect** code for this rule:

```javascript
import setupModule from './some-other-test';
import { module, test } from 'qunit';

module('Acceptance | module', setupModule());
```

```javascript
import { beforeEachSetup, testMethod } from './some-other-test';
import { module, test } from 'qunit';

module('Acceptance | module', beforeEachSetup());
```

```javascript
import testModule from '../../test-dir/another-test';
import { module, test } from 'qunit';

module('Acceptance | module', testModule());
```

```javascript
// some-test.js
export function beforeEachSetup() {}
```

```javascript
// some-test.js
function beforeEachSetup() {}

export default { beforeEachSetup };
```

Examples of **correct** code for this rule:

```javascript
import setupModule from './some-test-helper';
import { module, test } from 'qunit';

module('Acceptance | module', setupModule());
```

```javascript
// some-test-helper.js
export function beforeEachSetup() {
  // ...
}
```

```javascript
// some-test-helper.js
function beforeEachSetup() {}

export default { beforeEachSetup };
```
