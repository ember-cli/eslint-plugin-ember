# Do not allow anything else than constants in global module namespace. (no-leaking-state-in-program-scope)

This rule attempts to catch any possible hidden state thanks to program scope variables.


## Rule Details

Program scope variables that can store value retrieved at runtime can potentially introduce bugs in tests where they might pollute environments between two tests.

Consider following service:

```js
var cachedFoo = null;

export default Service.extend({
  fetchFoo(count) {
    if(!cachedFoo) {
      fetch(`./api/?results=${count}`).then(function(response) {
        cachedFoo = response;
      });
    }
  }

  getFoo() {
    return cachedFoo;
  }
});
```

If there are two tests calling this service with different value for `count` when calling `fetchFoo`, then calls to `getFoo` will always return the response of the first test.

Examples of **incorrect** code for this rule:

```js
var foo = 'bar';

export default Service.extend({});
```

Examples of **correct** code for this rule:

```js
const foo = 'bar';

export default Service.extend({});
```

```js
export default Service.extend({
  init() {
    this.set('foo', 'bar');
  }
});
```
