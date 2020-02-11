# no-get-with-default

This rule attempts to catch and prevent the use of `getWithDefault`.

## Rule Details

Even though the behavior for `getWithDefault` is more defined such that it only falls back to the default value on `undefined`,
its inconsistency with the native `||` is confusing to many developers who assume otherwise. This rule encourages developers to use
the native `||` operator instead.

In addition, [Nullish Coalescing Operator `??`](https://github.com/tc39/proposal-nullish-coalescing) will land in the JavaScript language soon so developers can leverage safe property access with native support instead of using `getWithDefault`.

## Examples

Examples of **incorrect** code for this rule:

```js
const test = this.getWithDefault('key', []);
```

```js
const test = getWithDefault(this, 'key', []);
```

Examples of **correct** code for this rule:

```js
const test = this.key === undefined ? [] : this.key;
```

```js
// the behavior of this is different because `test` would be assigned `[]` on any falsy value instead of on only `undefined`.
const test = this.key || [];
```

## References

- [RFC](https://github.com/emberjs/rfcs/pull/554/) to deprecate `getWithDefault`
- [spec](http://api.emberjs.com/ember/3.13/functions/@ember%2Fobject/getWithDefault)

## Related Rules

- [no-get](no-get.md)
