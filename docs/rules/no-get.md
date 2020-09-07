# no-get

:white_check_mark: The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

:wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

Starting in Ember 3.1, native ES5 getters are available, which eliminates much of the need to use `get` / `getProperties` on Ember objects.

## Rule Details

This rule disallows:

* `this.get('someProperty')` when `this.someProperty` can be used
* `this.getProperties('prop1', 'prop2')` when `{ prop1: this.prop1, prop2: this.prop2 }` can be used

**WARNING**: there are a number of circumstances where `get` / `getProperties` still need to be used, and you may need to manually disable the rule for these (although the rule will attempt to ignore them):

* Ember proxy objects (`ObjectProxy`, `ArrayProxy`)
* Objects implementing the `unknownProperty` method

In addition, `mirage/config.js` will be excluded from this rule.

## Examples

Examples of **incorrect** code for this rule:

```js
const foo = this.get('someProperty');
```

```js
import { get } from '@ember/object';

const foo = get(this, 'someProperty');
```

```js
const { prop1, prop2 } = this.getProperties('prop1', 'prop2');
```

```js
import { getProperties } from '@ember/object';

const foo = getProperties(this, 'prop1', 'prop2');
```

Examples of **correct** code for this rule:

```js
const foo = this.someProperty;
```

```js
const foo = this.nested?.path; // Optional chaining can be useful if the nested path can have null or undefined properties in it.
```

```js
const foo = this.get('some.nested.property'); // Allowed if `ignoreNestedPaths` option is enabled.
```

```js
const { prop1, prop2 } = this;
```

```js
const foo = { prop1: this.prop1, prop2: this.prop2 };
```

```js
import ObjectProxy from '@ember/object/proxy';

export default ObjectProxy.extend({
  someFunction() {
    const foo = this.get('propertyInsideProxyObject'); // Allowed because inside proxy object.
  }
});
```

```js
import EmberObject from '@ember/object';

export default EmberObject.extend({
  unknownProperty(key) {},
  someFunction() {
    const foo = this.get('property'); // Allowed because inside object implementing `unknownProperty()`.
  }
});
```

## Configuration

This rule takes an optional object containing:

* `boolean` -- `ignoreGetProperties` -- whether the rule should ignore `getProperties` (default `false`)
* `boolean` -- `ignoreNestedPaths` -- whether the rule should ignore `this.get('some.nested.property')` (default `false`)
* `boolean` -- `useOptionalChaining` -- whether the rule should use the [optional chaining operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) `?.` to autofix nested paths such as `this.get('some.nested.property')` to `this.some?.nested?.property` (when this option is off, these nested paths won't be autofixed at all) (default `false`)
* `boolean` -- `catchSafeObjects` -- whether the rule should catch `get(foo, 'bar')` (default `true`)
* `boolean` -- `catchUnsafeObjects` -- whether the rule should catch `foo.get('bar')` even though we don't know for sure if `foo` is an Ember object (default `false`)

## Related Rules

* [no-proxies](no-proxies.md)

## References

* [Ember 3.1 Release Notes](https://blog.emberjs.com/2018/04/13/ember-3-1-released.html) describing "ES5 Getters for Computed Properties"
* [Ember get Spec](https://api.emberjs.com/ember/release/functions/@ember%2Fobject/get)
* [Ember getProperties Spec](https://api.emberjs.com/ember/release/functions/@ember%2Fobject/getProperties)
* [Ember ES5 Getter RFC](https://github.com/emberjs/rfcs/blob/master/text/0281-es5-getters.md)
* [es5-getter-ember-codemod](https://github.com/rondale-sc/es5-getter-ember-codemod)
* [More context](https://github.com/emberjs/ember.js/issues/16148) about the proxy object exception to this rule
