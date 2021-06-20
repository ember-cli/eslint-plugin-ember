# require-fetch-import

Using `fetch()` without importing it causes the browser to use the native,
non-wrapped `window.fetch()`. This is generally fine, but makes testing harder
because this non-wrapped version does not have a built-in test waiter. Because
of this it is generally better to use [ember-fetch] and explicitly
`import fetch from 'fetch'`.

Note: this rule is not in the `recommended` configuration because the global `fetch` is a web standard.

## Rule Details

The rule looks for `fetch()` calls and reports them as issues if no
corresponding import declaration is found.

## Examples

Examples of **incorrect** code for this rule:

```js
const result = fetch('/something');
```

Examples of **correct** code for this rule:

```js
import fetch from 'fetch';

const result = fetch('/something');
```

## Migration

* Add `import fetch from 'fetch';` to all files that need it

## References

* [@ember/test-waiters](https://github.com/emberjs/ember-test-waiters) addon

[ember-fetch]: https://github.com/ember-cli/ember-fetch/
