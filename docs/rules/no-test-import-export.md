# No importing of test files

**TL;DR** Do not import "-test.js" file in a test file. This will cause the module and tests from the imported file to be executed again. In the same vain, no exports within a test file.

Due to how qunit unloads a test module, importing a test file will cause any modules and tests within the file to be executed every time it gets loaded. If you want to import any helper functions or tests to be shared between multiple test files, please make it a test-helper that gets imported by the test file.

```javascript
// GOOD

import setupModule from './some-test-helper';
import { module, test } from 'qunit';

module('Acceptance | module', setupModule());
```

```javascript
// GOOD

// some-test-helper.js
export function beforeEachSetup(){ ... };
```

```javascript
// GOOD

// some-test-helper.js
function beforeEachSetup(){};

export default {beforeEachSetup};
```

```javascript
// BAD

import setupModule from './some-other-test';
import { module, test } from 'qunit';

module('Acceptance | module', setupModule());
```

```javascript
// BAD

import {
  beforeEachSetup,
  testMethod,
} from './some-other-test';
import { module, test } from 'qunit';

module('Acceptance | module', beforeEachSetup());
```

```javascript
// BAD

import testModule from '../../test-dir/another-test';
import { module, test } from 'qunit';

module('Acceptance | module', testModule());
```

```javascript
// BAD

// some-test.js
export function beforeEachSetup(){};
```

```javascript
// BAD

// some-test.js
function beforeEachSetup(){};

export default {beforeEachSetup};
```
