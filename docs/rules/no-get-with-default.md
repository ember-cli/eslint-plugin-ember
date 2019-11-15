# No getWithDefault (no-get-with-default)

This rule attempts to catch and prevent the use of `getWithDefault`.

## Rule Details

Even though the behavior for `getWithDefault` is more defined such that it only falls back to the default value on `undefined`,
its inconsistency with the native `||` is confusing to many developers who assume otherwise. This rule encourages developers to use
the native `||` operator instead.

Violation includes:

- `this.getWithDefault(...);`
- `getWithDefault(...);`;

This rule **forbids** the following:

```js
const test = this.getWithDefault('key', []);
```

```js
const test = getWithDefault(this, 'key', []);
```

This rule **allows** the following:

```js
const test = this.get('key') || [];
```

```js
const test = get(this, 'key') || [];
```

### References

- [RFC](https://github.com/emberjs/rfcs/pull/554/) to deprecate `getWithDefault`
