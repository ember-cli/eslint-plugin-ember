# ember/no-tracked-built-ins

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Enforce usage of `@ember/reactive` imports instead of `tracked-built-ins`.

## Context

Per [RFC #1068](https://github.com/emberjs/rfcs/pull/1068), the tracked collection utilities from the `tracked-built-ins` package are being moved into the framework as `@ember/reactive`. The new API also changes from class constructors (`new TrackedArray(...)`) to factory functions (`trackedArray(...)`).

## Rule Details

This rule detects imports from `tracked-built-ins` and provides an autofix to convert them to `@ember/reactive` with the new function-based API.

The following mappings are applied:

| Old (`tracked-built-ins`) | New (`@ember/reactive`) |
|--------------------------|------------------------|
| `TrackedArray` | `trackedArray` |
| `TrackedObject` | `trackedObject` |
| `TrackedMap` | `trackedMap` |
| `TrackedSet` | `trackedSet` |
| `TrackedWeakMap` | `trackedWeakMap` |
| `TrackedWeakSet` | `trackedWeakSet` |

Additionally, `new` expressions using these imports are automatically converted to direct function calls.

## Examples

Examples of **incorrect** code for this rule:

```js
import { TrackedArray } from 'tracked-built-ins';

const arr = new TrackedArray([1, 2, 3]);
```

```js
import { TrackedObject, TrackedMap } from 'tracked-built-ins';

const obj = new TrackedObject({ a: 1 });
const map = new TrackedMap();
```

Examples of **correct** code for this rule:

```js
import { trackedArray } from '@ember/reactive';

const arr = trackedArray([1, 2, 3]);
```

```js
import { trackedObject, trackedMap } from '@ember/reactive';

const obj = trackedObject({ a: 1 });
const map = trackedMap();
```

## Migration

This rule provides automatic fixes via `--fix`. Running ESLint with the `--fix` flag will:

1. Replace `import { TrackedArray } from 'tracked-built-ins'` with `import { trackedArray } from '@ember/reactive'`
2. Replace `new TrackedArray(...)` with `trackedArray(...)`

## References

- [RFC #1068: Built in tracking utilities for common collections](https://github.com/emberjs/rfcs/pull/1068)
- [`tracked-built-ins` package](https://github.com/tracked-tools/tracked-built-ins)
