# no-invalid-debug-function-arguments

✅ The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

Catch usages of Ember&#39;s `assert()` / `warn()` / `deprecate()` functions that have the arguments passed in the wrong order.

This rule aims to catch a common mistake when using Ember's debug functions:

* `assert(String description, Boolean condition)`
* `warn(String description, Boolean condition, Object options)`
* `deprecate(String description, Boolean condition, Object options)`

When calling one of these functions, the author may mistakenly pass the `description` and `condition` arguments in the reverse order, and not notice because the function will be silent with a truthy string as the `condition`.

## Examples

Examples of **incorrect** code for this rule:

```js
import { assert, warn } from '@ember/debug';
import { deprecate } from '@ember/application/deprecations';

// ...

assert(label, 'Label must be present.');
warn(label, 'Label must be present.', { id: 'missing-label' });
deprecate(title, 'Title is no longer supported.', { id: 'unwanted-title', until: 'some-version' });
```

Examples of **correct** code for this rule:

```js
import { assert, warn } from '@ember/debug';
import { deprecate } from '@ember/application/deprecations';

// ...

assert('Label must be present.', label);
warn('Label must be present.', label, { id: 'missing-label' });
deprecate('Title is no longer supported.', title, { id: 'unwanted-title', until: 'some-version' });
```

## Further Reading

* See the [documentation](https://www.emberjs.com/api/ember/release/functions/@ember%2Fdebug/assert) for the Ember `assert` function.
* See the [documentation](https://www.emberjs.com/api/ember/release/functions/@ember%2Fdebug/warn) for the Ember `warn` function.
* See the [documentation](https://emberjs.com/api/api/ember/release/functions/@ember%2Fapplication%2Fdeprecations/deprecate) for the Ember `deprecate` function.
