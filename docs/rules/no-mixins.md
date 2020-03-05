# no-mixins

Using mixins to share code appears easy at first. But they add significant complexity as a project grows. Furthermore, the [Octane programming model](https://guides.emberjs.com/release/upgrading/current-edition/) eliminates the need to use them in favor of native class semantics and other primitives.

For practical strategies on removing mixins see [this discourse thread](https://discuss.emberjs.com/t/best-way-to-replace-mixins/17395/2).

## Rule Details

This rule disallows importing a mixin. This is different than [no-new-mixins](no-new-mixins.md), which disallows creating a mixin (e.g. `Mixin.create({})`). Both should be used in an app that wants to disallow the use of mixins.

## Examples

Examples of **incorrect** code for this rule:

```javascript
// my-octane-component.js
import Component from '@ember/component';
import FooMixin from '../utils/mixins/foo';

export default class FooComponent extends Component.extend(FooMixin) {
  // ...
}
```

```javascript
// my-component.js
import myMixin from 'my-mixin';

export default Component.extend(myMixin, {
  aComputedProperty: computed('obj', function() {
    return this.isValidClassName(obj.className);
  })
});
```

Examples of **correct** code for this rule:

```javascript
// my-utils.js
export function isValidClassName(classname) {
  return Boolean(className.match('-class'));
}

export function hideModal(obj, value) {
  set(obj, 'isHidden', value);
}
```

```javascript
// my-component.js
import { isValidClassName } from 'my-utils';

export default Component.extend({
  aComputedProperty: computed('obj', function() {
    return isValidClassName(get(obj, 'className'));
  })
});
```

## References

* [Mixins Considered Harmful](https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html)
* [Why Are Mixins Considered Harmful?](http://raganwald.com/2016/07/16/why-are-mixins-considered-harmful.html)

## Related Rules

* [no-new-mixins](no-new-mixins.md)
