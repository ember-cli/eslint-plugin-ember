## Disallow unnecessary usage of Ember\'s `getProperties` function

### Rule name: `no-get-properties`

**NOTE**: this rule is deprecated as it has been consolidated into the [no-get](no-get.md) rule.

Starting in Ember 3.1, native ES5 getters are available, which eliminates much of the need to use `get` and `getProperties` on Ember objects. In particular, `getProperties` no longer needs to be used with destructuring assignments.

### Rule Details

This rule disallows unnecessarily using `this.getProperties()` with destructuring assignments.

**WARNING**: there are a number of circumstances where `getProperties` still needs to be used, and you may need to manually disable the rule for these:

* Ember proxy objects (`ObjectProxy`, `ArrayProxy`)
* Objects implementing the `unknownProperty` method

### Examples

Examples of **incorrect** code for this rule:

```js
const { abc, def } = this.getProperties('abc', 'def');
```

```js
import { getProperties } from '@ember/object';
const { abc, def } = getProperties(this, 'abc', 'def');
```

Examples of **correct** code for this rule:

```js
const { abc, def } = this;
```

```js
const { foo, barBaz } = this.getProperties('foo', 'bar.baz'); // Allowed because of nested path.
```

### References

* [JavaScript Destructuring Assignment Spec](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
* [Ember 3.1 Release Notes](https://blog.emberjs.com/2018/04/13/ember-3-1-released.html) describing "ES5 Getters for Computed Properties"
* [Ember getProperties Spec](https://api.emberjs.com/ember/release/functions/@ember%2Fobject/getProperties)
* [Ember ES5 Getter RFC](https://github.com/emberjs/rfcs/blob/master/text/0281-es5-getters.md)
* [es5-getter-ember-codemod](https://github.com/rondale-sc/es5-getter-ember-codemod)
* [More context](https://github.com/emberjs/ember.js/issues/16148) about the proxy object exception to this rule

### Related Rules

* [no-get](no-get.md)
