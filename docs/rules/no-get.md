# no-get

Starting in Ember 3.1, native ES5 getters are available, which eliminates much of the need to use `get` on Ember objects.

## Rule Details

This rule disallows using `this.get('someProperty')` when `this.someProperty` can be used.

**WARNING**: there are a number of circumstances where `get` still needs to be used, and you may need to manually disable the rule for these:

* Ember proxy objects (`ObjectProxy`, `ArrayProxy`)
* Objects implementing the `unknownProperty` method

## Examples

Examples of **incorrect** code for this rule:

```js
const foo = this.get('someProperty');
```

```js
import { get } from '@ember/object';
const foo = get(this, 'someProperty');
```

Examples of **correct** code for this rule:


```js
const foo = this.someProperty;
```

```js
const foo = this.get('some.nested.property'); // Allowed because of nested path.
```

## References

* [Ember 3.1 Release Notes](https://blog.emberjs.com/2018/04/13/ember-3-1-released.html) describing "ES5 Getters for Computed Properties"
* [Ember get Spec](https://api.emberjs.com/ember/release/functions/@ember%2Fobject/get)
* [Ember ES5 Getter RFC](https://github.com/emberjs/rfcs/blob/master/text/0281-es5-getters.md)
* [es5-getter-ember-codemod](https://github.com/rondale-sc/es5-getter-ember-codemod)
* [More context](https://github.com/emberjs/ember.js/issues/16148) about the proxy object exception to this rule

## Related Rules

* [no-get-properties](no-get-properties.md)
