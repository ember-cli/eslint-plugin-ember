# Catch usages of Ember&#39;s `assert()` function that have the arguments passed in the wrong order. (assert-arg-order)

This rule aims to catch a common mistake when using Ember's `assert(String description, Boolean condition)` function. When writing an `assert`, the author may mistakenly pass the arguments in the reverse order, and not notice because the `assert` will pass with a truthy string as its second argument.

## Rule Details

Examples of **incorrect** code for this rule:

```js
import { assert } from '@ember/debug';

...

assert(label, 'Label must be present.');
```

Examples of **correct** code for this rule:

```js
import { assert } from '@ember/debug';

...

assert('Label must be present.', label);
```

## Further Reading

* See the [documentation](https://www.emberjs.com/api/ember/release/functions/@ember%2Fdebug/assert) for the Ember `assert` function.
