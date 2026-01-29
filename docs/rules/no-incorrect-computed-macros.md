# ember/no-incorrect-computed-macros

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule attempts to find incorrect usages of computed property macros, such as calling them with the incorrect number of arguments.

It currently only catches using the [and](https://api.emberjs.com/ember/release/functions/@ember%2Fobject%2Fcomputed/and) and [or](https://api.emberjs.com/ember/release/functions/@ember%2Fobject%2Fcomputed/or) macros with the wrong number of arguments, but may be expanded later.

## Examples

Examples of **incorrect** code for this rule:

```js
import { and, or } from '@ember/object/computed';

export default Component.extend({
  macroPropertyAnd: and('someProperty'), // Not enough arguments.

  macroPropertyOr: or('someProperty'), // Not enough arguments.
});
```

Examples of **correct** code for this rule:

```js
import { and, or, readOnly } from '@ember/object/computed';

export default Component.extend({
  macroPropertyReadOnly: readOnly('someProperty'),

  macroPropertyAnd: and('someProperty1', 'someProperty2'),

  macroPropertyOr: or('someProperty1', 'someProperty2'),
});
```

## Related Rules

- [require-computed-macros](require-computed-macros.md)

## References

- [Guide](https://guides.emberjs.com/release/object-model/computed-properties/) for computed properties
- [Spec](https://api.emberjs.com/ember/release/modules/@ember%2Fobject#functions-computed) for computed property macros
