# no-proxies

You may want to disallow the use of Ember proxy objects (`ObjectProxy`, `ArrayProxy`) in your application for a number of reasons:

1. Proxies are relatively rare compared to direct property access on objects.
2. In part due to their rarity, proxies are not as widely understood.
3. Proxies can add unnecessary complexity.
4. Proxies do not support ES5 getters which were introduced in [Ember 3.1](https://blog.emberjs.com/2018/04/13/ember-3-1-released.html) (they still require using `this.get()`)

Note: this rule is not in the `recommended` configuration because there are legitimate usages of proxies.

## Rule Details

This rule disallows using Ember proxy objects (`ObjectProxy`, `ArrayProxy`).

## Examples

Examples of **incorrect** code for this rule:

```js
import ObjectProxy from '@ember/object/proxy';
```

```js
import ArrayProxy from '@ember/array/proxy';
```

## Related Rules

- [no-get](no-get.md) which may need to be disabled for `this.get()` usages in proxy objects

## References

- [ObjectProxy](https://api.emberjs.com/ember/release/classes/ObjectProxy) spec
- [ArrayProxy](https://api.emberjs.com/ember/release/classes/ArrayProxy) spec
