# ember/no-legacy-computed

<!-- end auto-generated rule header -->

Disallow legacy computed properties and computed macros.

## Rule Details

This rule disallows:

- `computed` imported from `@ember/object`
- Any import from `@ember/object/computed` (for example `and`, `gt`, `sortBy`, and other macros)

Use `@tracked` and native getters instead.

## Examples

Examples of **incorrect** code for this rule:

```js
import { computed } from '@ember/object';
```

```js
import { and, gt, sortBy } from '@ember/object/computed';
```

Examples of **correct** code for this rule:

```js
import { tracked } from '@glimmer/tracking';

class Example {
  @tracked count = 0;

  get doubled() {
    return this.count * 2;
  }
}
```
