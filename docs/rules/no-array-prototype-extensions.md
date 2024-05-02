# ember/no-array-prototype-extensions

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

By default, Ember extends certain native JavaScript objects with additional methods. This can lead to problems in some situations. One example is relying on these methods in an addon that is used inside an app that has the extensions disabled.

The prototype extensions for the `Array` object were deprecated in [RFC #848](https://rfcs.emberjs.com/id/0848-deprecate-array-prototype-extensions).

Some alternatives:

- Use native array functions instead of `.filterBy()`, `.toArray()` in Ember modules
- Use lodash helper functions instead of `.uniqBy()`, `.sortBy()` in Ember modules
- Use immutable update style with `@tracked` properties or `TrackedArray` from `tracked-built-ins` instead of `.pushObject`, `removeObject` in Ember modules

## Rule Details

This rule will disallow method calls that match any of the forbidden `Array` prototype extension method names.

The rule autofixes all [EmberArray](https://api.emberjs.com/ember/release/classes/EmberArray) functions. It does not autofix the mutation functions from [MutableArray](https://api.emberjs.com/ember/release/classes/MutableArray) or `firstObject` / `lastObject`, as these involve reactivity/observability and may require a more involved change to convert to `@tracked` or `TrackedArray`.

To reduce false positives, the rule ignores some common known-non-array classes/objects whose functions overlap with the array extension function names:

- `Set.clear()`
- `Map.clear()`
- `localStorage.clear()` / `sessionStorage.clear()`
- `Promise.any()` / `Promise.reject()`
- Lodash / jQuery
- Ember Data `this.store` service
- etc

If you run into additional false positives, please file a bug or submit a PR to add it to the rule's hardcoded ignore list.

This rule is not in the `recommended` configuration because of the risk of false positives.

## Examples

Examples of **incorrect** code for this rule:

```js
/** Helper functions **/
import Component from '@glimmer/component';

export default class SampleComponent extends Component {
  abc = ['x', 'y', 'z', 'x'];

  def = this.abc.without('x');
  ghi = this.abc.uniq();
  jkl = this.abc.toArray();
  mno = this.abc.uniqBy('y');
  pqr = this.abc.sortBy('z');
}
```

```js
/** Observable-based functions **/
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class SampleComponent extends Component {
  abc = [];
  @action
  someAction(newItem) {
    this.abc.pushObject('1');
  }
}
```

Examples of **correct** code for this rule:

```js
/** Helper functions **/
import Component from '@glimmer/component';
import { uniqBy, sortBy } from 'lodash';

export default class SampleComponent extends Component {
  abc = ['x', 'y', 'z', 'x'];

  def = this.abc.filter((el) => el !== 'x');
  ghi = [...new Set(this.abc)];
  jkl = [...this.abc];
  mno = uniqBy(this.abc, 'y');
  pqr = sortBy(this.abc, 'z');
}
```

```js
/** Observable-based functions **/
/** Use immutable tracked property is OK **/
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SampleComponent extends Component {
  @tracked abc = [];

  @action
  someAction(newItem) {
    this.abc = [...this.abc, newItem];
  }
}
```

```js
/** Observable-based functions **/
/** Use TrackedArray is OK **/
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { TrackedArray } from 'tracked-built-ins';

export default class SampleComponent extends Component {
  @tracked abc = new TrackedArray();

  @action
  someAction(newItem) {
    abc.push(newItem);
  }
}
```

```js
/** Direct usage of `@ember/array` **/
/** Use A() is OK **/
import { A } from '@ember/array';

const arr = A(['a', 'a', 'b', 'b']);
arr.uniq();
```

## References

- [EmberArray](https://api.emberjs.com/ember/release/classes/EmberArray)
- Ember [MutableArray](https://api.emberjs.com/ember/release/classes/MutableArray)
- [Ember Prototype extensions documentation](https://guides.emberjs.com/release/configuring-ember/disabling-prototype-extensions/)
- [Ember Array prototype extensions deprecation RFC](https://rfcs.emberjs.com/id/0848-deprecate-array-prototype-extensions)
- [Native JavaScript array functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

## Related Rules

- [no-array-prototype-extensions](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-array-prototype-extensions.md) from ember-template-lint
- [no-function-prototype-extensions](no-function-prototype-extensions.md)
- [no-string-prototype-extensions](no-string-prototype-extensions.md)
