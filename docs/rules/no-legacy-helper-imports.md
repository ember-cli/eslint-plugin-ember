# ember/no-legacy-helper-imports

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallow legacy helper/modifier imports that are built into Ember 7.1+.

## Rule Details

This rule flags imports from:

- `ember-truth-helpers`
- `ember-element-helper`
- `@ember/helper` (`array`, `hash`, `fn`)
- `@ember/modifier` (`on`)

When safe, the autofix removes those imports and renames local aliases to the built-in keyword names.

## Examples

Examples of **incorrect** code for this rule:

```js
import { notEq as isDifferent } from 'ember-truth-helpers';

const result = isDifferent(a, b);
```

```js
import element_ from 'ember-element-helper';

const value = element_(this.id);
```

Examples of **correct** code for this rule:

```js
const result = neq(a, b);
const value = element(this.id);
```
