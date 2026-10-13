# ember/no-deprecated-imports

<!-- end auto-generated rule header -->

Ember deprecates APIs through RFCs. Each deprecation becomes available in a specific `ember-source` version, and is removed in a later major. This rule flags imports of those APIs, so you can migrate before they are removed.

## Rule Details

The rule reads the installed `ember-source` version and reports each deprecated import once that version reaches the deprecation. It uses the version where ember-source enables the deprecation, or the version where it becomes available when it is not enabled yet.

To migrate ahead of time, opt in to deprecations from upcoming versions with the `reportAll` option, or per import path with the `imports` option.

When the rule cannot find `ember-source`, it does nothing, unless you set `reportAll: true` or `report: true` for an import path.

The rule checks `import` declarations (including `import type`), and `export ... from` re-exports. It does not check dynamic `import()`. A namespace import (`import * as x from '...'`) or `export * from '...'` is only reported when the whole module is deprecated.

### Deprecated imports

| Ember | Import path                         | Deprecated exports                                                                                                                 | Deprecation id                        | Status   |
| ----- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | -------- |
| 6.3   | `@ember/service`                    | `inject`                                                                                                                           | `importing-inject-from-ember-service` | released |
| 6.5   | `ember`                             | the whole module                                                                                                                   | `deprecate-import-ember-from-ember`   | released |
| 7.4   | `@ember/object/mixin`               | default (`Mixin`)                                                                                                                  | `deprecate-mixins`                    | released |
| 7.4   | `@ember/object/evented`             | default (`Evented`), `on`                                                                                                          | `deprecate-evented`                   | released |
| 7.4   | `@ember/object/events`              | `addListener`, `removeListener`, `sendEvent`                                                                                       | `deprecate-evented`                   | released |
| 7.4   | `@ember/object/promise-proxy-mixin` | default                                                                                                                            | `deprecate-promise-proxy-mixin`       | released |
| 7.4   | `@ember/array/proxy`                | default (`ArrayProxy`)                                                                                                             | `deprecate-array-proxy`               | released |
| 7.4   | `@ember/object/proxy`               | default (`ObjectProxy`)                                                                                                            | `deprecate-object-proxy`              | released |
| 7.5   | `@ember/utils`                      | the whole module                                                                                                                   | `deprecate-ember-utils`               | merged   |
| 7.5   | `@ember/object/computed`            | `empty`, `notEmpty`, `none`                                                                                                        | `deprecate-ember-utils`               | merged   |
| 7.5   | `@ember/object/computed`            | `alias`, `and`, `bool`, `deprecatingAlias`, `equal`, `gt`, `gte`, `lt`, `lte`, `match`, `not`, `oneWay`, `or`, `readOnly`, `reads` | `deprecate-computed-macros`           | merged   |
| 7.5   | `@ember/object/computed`            | `collect`, `filter`, `filterBy`, `intersect`, `map`, `mapBy`, `max`, `min`, `setDiff`, `sort`, `sum`, `union`, `uniq`, `uniqBy`    | `deprecate-array-computed-macros`     | open PR  |
| 7.5   | `@ember/array`                      | `A`                                                                                                                                | `deprecate-ember-array-a`             | open PR  |
| 7.5   | `@ember/array`                      | default (`EmberArray`)                                                                                                             | `deprecate-ember-array-mixin`         | open PR  |
| 7.5   | `@ember/array`                      | `MutableArray`                                                                                                                     | `deprecate-mutable-array-mixin`       | open PR  |
| 7.5   | `@ember/array/mutable`              | default (`MutableArray`)                                                                                                           | `deprecate-mutable-array-mixin`       | open PR  |
| 7.5   | `@ember/array`                      | `NativeArray`                                                                                                                      | `deprecate-native-array-mixin`        | open PR  |
| 7.5   | `@ember/object/observable`          | default (`Observable`)                                                                                                             | `deprecate-observable-mixin`          | open PR  |
| 7.5   | `@ember/enumerable`                 | default (`Enumerable`)                                                                                                             | `deprecate-enumerable-mixin`          | open PR  |
| 7.5   | `@ember/enumerable/mutable`         | default (`MutableEnumerable`)                                                                                                      | `deprecate-mutable-enumerable-mixin`  | open PR  |
| 7.5   | `@ember/controller`                 | `ControllerMixin`                                                                                                                  | `deprecate-controller-mixin`          | open PR  |
| 7.5   | `@ember/component`                  | default (`Component`)                                                                                                              | `ember-component`                     | draft PR |
| 7.5   | `@ember/object`                     | default (`EmberObject`)                                                                                                            | `deprecate-ember-object`              | draft PR |

Deprecations from open or draft PRs can still change before they ship. The versions and ids follow the deprecation registry in ember-source (`packages/@ember/-internals/deprecations/index.ts`).

## Examples

With `ember-source` 7.4 installed, examples of **incorrect** code for this rule:

```js
import Mixin from '@ember/object/mixin';
import Evented, { on } from '@ember/object/evented';
import ArrayProxy from '@ember/array/proxy';
```

Examples of **correct** code for this rule:

```js
// Not deprecated
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { trackedArray } from '@ember/reactive/collections';

// Deprecated in 7.5, not reported on 7.4 unless you opt in
import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';
```

## Configuration

<!-- begin auto-generated rule options list -->

| Name        | Description                                                                                                      | Type    | Default | Required |
| :---------- | :--------------------------------------------------------------------------------------------------------------- | :------ | :------ | :------- |
| `imports`   | Per import path overrides. `report: true` opts in to that path early, `report: false` silences it.               | Object  |         |          |
| `report`    |                                                                                                                  | Boolean |         | Yes      |
| `reportAll` | Report every known deprecation, including ones that are not yet available in the installed ember-source version. | Boolean | `false` |          |

<!-- end auto-generated rule options list -->

Report every known deprecation, including those from upcoming Ember versions:

```js
module.exports = {
  rules: {
    'ember/no-deprecated-imports': ['error', { reportAll: true }],
  },
};
```

Opt in early to some import paths, and silence others. A per-path `report` value takes precedence over `reportAll` and over the installed version:

```js
module.exports = {
  rules: {
    'ember/no-deprecated-imports': [
      'error',
      {
        imports: {
          '@ember/array': { report: true },
          '@ember/object/computed': { report: false },
        },
      },
    ],
  },
};
```

Only the import paths in the table above are allowed as keys of `imports`.

## Related Rules

- [no-proxies](no-proxies.md)
- [no-mixins](no-mixins.md)
- [no-new-mixins](no-new-mixins.md)
- [no-classic-components](no-classic-components.md)
- [no-tracked-built-ins](no-tracked-built-ins.md)
- [no-legacy-helper-imports](no-legacy-helper-imports.md)

## References

- [Ember deprecation guides](https://deprecations.emberjs.com/)
- [Ember RFCs](https://rfcs.emberjs.com/)
