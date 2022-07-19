# no-array-prototype-extensions

✅ The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

Do not use Ember's `array` prototype extensions.

Use native array functions instead of `.filterBy`, `.toArray()` in Ember modules.

Use lodash helper functions instead of `.uniqBy()`, `sortBy()` in Ember modules.

Use immutable update style with `@tracked` properties or `TrackedArray` from `tracked-built-ins` instead of `.pushObject`, `removeObject` in Ember modules.

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
    this.abc = [...abc, newItem];
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

## References

* [EmberArray](https://api.emberjs.com/ember/release/classes/EmberArray)
* Ember [MutableArray](https://api.emberjs.com/ember/release/classes/MutableArray)
* [Prototype extensions documentation](https://guides.emberjs.com/release/configuring-ember/disabling-prototype-extensions/)
* Array prototype extensions deprecation RFC (TODO: add link when available)
* [Native JavaScript array functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

## Related Rules

* [no-function-prototype-extensions](no-function-prototype-extensions.md)
* [no-string-prototype-extensions](no-string-prototype-extensions.md)
