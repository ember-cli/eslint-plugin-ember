# ember/no-assignment-of-untracked-properties-used-in-tracking-contexts

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Ember 3.13 added an assertion that fires when using assignment `this.x = 123` on an untracked property that is used in a tracking context such as a computed property.

> You attempted to update "propertyX" to "valueY",
> but it is being tracked by a tracking context, such as a template, computed property, or observer.
>
> In order to make sure the context updates properly, you must invalidate the property when updating it.
>
> You can mark the property as `@tracked`, or use `@ember/object#set` to do this.

## Rule Details

This rule catches assignments of untracked properties that are used as computed property dependency keys.

## Examples

Examples of **incorrect** code for this rule:

```js
import { computed } from '@ember/object';
import Component from '@ember/component';

class MyComponent extends Component {
  @computed('x') get myProp() {
    return this.x;
  }
  myFunction() {
    this.x = 123; // Not okay to use assignment here.
  }
}
```

Examples of **correct** code for this rule:

```js
import { computed, set } from '@ember/object';
import Component from '@ember/component';

class MyComponent extends Component {
  @computed('x') get myProp() {
    return this.x;
  }
  myFunction() {
    set(this, 'x', 123); // Okay because it uses set.
  }
}
```

```js
import { computed, set } from '@ember/object';
import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';

class MyComponent extends Component {
  @tracked x;
  @computed('x') get myProp() {
    return this.x;
  }
  myFunction() {
    this.x = 123; // Okay because `x` is a tracked property.
  }
}
```

## Migration

The autofixer for this rule will update assignments to use `set`. Alternatively, you can begin using tracked properties.

## Configuration

- object -- containing the following properties:
  - array -- `extraMacros` -- Array of configurations for custom computed property macros which have dependent keys as arguments, each with hte following properties:
    - string -- `name` -- The name the macro is exported with
    - string -- `path` -- The file path used for importing the macro
    - string -- `indexName` -- If this macro can also be imported through an index (like `computed` for `computed.and`), include it here
    - string -- `indexPath` -- The path for importing the index. For example, with `import { computed } from '@ember/object'` and `computed.and(...)`, `@ember/object` is the `indexPath` and `computed` is the `indexName`.
    - array -- `argumentFormat` -- array of configurations for how to parse the arguments of the macro to extract the computed dependencies, with at least one of the following properties:
      - object -- `strings` -- Configuration for extracting raw strings from the argument list, with the following options:
        - number -- `count` -- How many arguments to consider as dependencies. Use `Number.MAX_VALUE` for all of them.
        - number -- `startIndex` -- Defaults to zero. If it's something else, that many arguments will be skipped before checking for `count` dependencies.
      - object -- `objects` -- Configuration for extracting the values of an object as dependency keys, with the following properties:
        - number -- `index` -- The index of the argument to be checked.
        - array -- `keys` -- Array of strings for which keys values should be checked for. If not provided, all values will be checked.

Example configuration:

```js
module.exports = {
  rules: {
    'ember/no-assignment-of-untracked-properties-used-in-tracking-contexts': {
      extraMacros: [
        {
          name: 'rejectBy',
          path: 'custom-macros/macros',
          indexName: 'customComputed',
          indexPath: 'custom-macros',
          argumentFormat: [
            {
              strings: {
                count: 1,
              },
            },
          ],
        },
        {
          name: 't',
          path: 'ember-intl',
          argumentFormat: [
            {
              objects: {
                index: 1,
              },
            },
          ],
        },
      ],
    },
  },
};
```

This configuration works for the [t macro](https://ember-intl.github.io/ember-intl/versions/master/docs/guide/translating-text#t) from ember-intl, and a custom `rejectBy` macro that behaves similarly to `filterBy` (with the second string argument not being a dependency):

```js
import { A, isArray } from '@ember/array';
import { get } from '@ember/object';

export default function rejectBy(dependentKey, propertyKey, value) {
  return computed(`${dependentKey}.@each.${propertyKey}`, function () {
    const parent = get(this, dependentKey);
    if (!isArray(parent)) {
      return A();
    }
    const callback =
      arguments.length === 2
        ? (item) => !get(item, propertyKey)
        : (item) => get(item, propertyKey) !== value;
    return A(parent.filter(callback));
  });
}
```

## References

- [Spec](https://api.emberjs.com/ember/release/functions/@ember%2Fobject/set) for `set()`
- [Spec](https://api.emberjs.com/ember/3.16/functions/@glimmer%2Ftracking/tracked) for `@tracked`
- [Guide](https://guides.emberjs.com/release/upgrading/current-edition/tracked-properties/) for tracked properties
