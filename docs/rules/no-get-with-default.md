# ember/no-get-with-default

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule attempts to catch and prevent the use of `getWithDefault`.

## Rule Details

Even though the behavior for `getWithDefault` is more defined such that it only falls back to the default value on `undefined`, its inconsistency with the native `||` is confusing to many developers who assume otherwise. Instead, this rule encourages developers to use:

- `||` operator
- ternary operator

In addition, [Nullish Coalescing Operator `??`](https://github.com/tc39/proposal-nullish-coalescing) will land in the JavaScript language soon so developers can leverage safe property access with native support instead of using `getWithDefault`. But note that `??` checks for either `undefined` or `null` whereas `getWithDefault` only checks for `undefined`.

## Examples

Examples of **incorrect** code for this rule:

```js
const test = this.getWithDefault('key', []);
```

```js
import { getWithDefault } from '@ember/object';

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

## Configuration

<!-- begin auto-generated rule options list -->

| Name                 | Description                                                                                                                                                 | Type    | Default |
| :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ | :------ |
| `catchSafeObjects`   | Whether the rule should catch non-`this` imported usages like `getWithDefault(person, 'name', '')`.                                                         | Boolean | `true`  |
| `catchUnsafeObjects` | Whether the rule should catch non-`this` usages like `person.getWithDefault('name', '')` even though we don't know for sure if `person` is an Ember object. | Boolean | `true`  |

<!-- end auto-generated rule options list -->

## References

- [RFC](https://github.com/emberjs/rfcs/pull/554/) to deprecate `getWithDefault`
- [spec](https://api.emberjs.com/ember/3.13/functions/@ember%2Fobject/getWithDefault)

## Related Rules

- [no-get](no-get.md)
