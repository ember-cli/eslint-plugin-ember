# ember/template-require-input-type

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule rejects `<input type="...">` values that are not one of the input
types defined by the HTML spec, and (optionally) requires every `<input>` to
declare a `type` attribute.

An invalid value like `<input type="foo">` silently falls back to the Text
state — the browser reports no error, but the author's intent (validation,
inputmode hint, platform keyboard) is lost. That's a genuine silent-failure
class, which this rule always flags and auto-fixes to `type="text"`.

A missing `type` attribute (`<input />`) is _spec-compliant_ — the
missing-value default is the Text state — so flagging it is a style /
consistency choice, not a correctness one. Opt in with `requireExplicit: true`
if your team wants parity with `template-require-button-type`.

## Examples

This rule **forbids** the following (always):

```hbs
<input type='' />
<input type='foo' />
<input type='TEXTY' />
```

With `requireExplicit: true` the rule **also forbids**:

```hbs
<input />
<input name='email' />
```

This rule **allows** the following:

```hbs
<input type='text' />
<input type='email' />
<input type='checkbox' />
<input type={{this.inputType}} />
```

Dynamic values such as `type={{this.inputType}}` are not flagged at lint time.

## Configuration

- `requireExplicit` (`boolean`, default `false`): when true, also flag
  `<input>` elements that have no `type` attribute. Auto-fix inserts
  `type="text"`.

```js
module.exports = {
  rules: {
    'ember/template-require-input-type': ['error', { requireExplicit: true }],
  },
};
```

## References

- [HTML spec — the input element](https://html.spec.whatwg.org/multipage/input.html#the-input-element)
- Adapted from [`html-validate`'s `no-implicit-input-type`](https://html-validate.org/rules/no-implicit-input-type.html) (MIT).
