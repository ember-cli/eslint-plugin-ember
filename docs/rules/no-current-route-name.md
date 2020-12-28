# no-current-route-name

The route name is something which is not visible to the user, so it can be
considered an implementation detail. The URL however is visible to the user, so
when writing tests it makes much more sense to assert against `currentURL()`
instead of `currentRouteName()`.

## Rule Details

This rule warns about any usage of the `currentRouteName()` test helper.

## Examples

Examples of **incorrect** code for this rule:

```js
assert.equal(currentRouteName(), 'foo');
```

Examples of **correct** code for this rule:

```js
assert.equal(currentURL(), '/foo');
```

## Migration

* Replace `currentRouteName()` with `currentURL()` and adjust
  the assertion expectations

## References

* [currentRouteName()](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#currentroutename) documentation
* [currentURL()](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#currenturl) documentation
