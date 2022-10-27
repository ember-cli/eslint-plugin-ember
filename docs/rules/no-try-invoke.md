# ember/no-try-invoke

✅ This rule is enabled in the `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

This rule will catch and prevent the use of `tryInvoke`.

## Rule Details

This rule aims to disallow the usage of `tryInvoke`. Native JavaScript language now supports [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) and developers are encouraged to use optional chaining `?.()` instead.

## Examples

Examples of **incorrect** code for this rule:

```js
import { tryInvoke } from '@ember/utils';

class FooComponent extends Component {
  foo() {
    tryInvoke(this.args, 'bar', ['baz']);
  }
}
```

Examples of **correct** code for this rule:

```js
class FooComponent extends Component {
  foo() {
    this.args.bar?.('baz');
  }
}
```

## References

- [RFC](https://github.com/emberjs/rfcs/pull/673) to deprecate `tryInvoke`
- [spec](https://api.emberjs.com/ember/release/functions/@ember%2Futils/tryInvoke)
