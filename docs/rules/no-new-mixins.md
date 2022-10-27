# ember/no-new-mixins

✅ This rule is enabled in the `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Using mixins to share code appears easy at first. But they add significant complexity as a project grows. Furthermore, the [Octane programming model](https://guides.emberjs.com/release/upgrading/current-edition/) eliminates the need to use them in favor of native class semantics and other primitives.

For practical strategies on removing mixins see [this discourse thread](https://discuss.emberjs.com/t/best-way-to-replace-mixins/17395/2).

For more details and examples of how mixins create problems down-the-line, see these excellent blog posts:

- [Mixins Considered Harmful](https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html)
- [Why Are Mixins Considered Harmful?](https://raganwald.com/2016/07/16/why-are-mixins-considered-harmful.html)

## Examples

Examples of **incorrect** code for this rule:

```js
// my-mixin.js
export default Mixin.create({
  isValidClassName(classname) {
    return Boolean(className.match('-class'));
  },

  hideModal(value) {
    this.set('isHidden', value);
  }
});
```

```js
// my-component.js
import myMixin from 'my-mixin';

export default Component.extend(myMixin, {
  aComputedProperty: computed('obj', function () {
    return this.isValidClassName(obj.className);
  })
});
```

Examples of **correct** code for this rule:

```js
// my-utils.js
export function isValidClassName(classname) {
  return Boolean(className.match('-class'));
}

export function hideModal(obj, value) {
  set(obj, 'isHidden', value);
}
```

```js
// my-component.js
import { isValidClassName } from 'my-utils';

export default Component.extend({
  aComputedProperty: computed('obj', function () {
    return isValidClassName(obj.className);
  })
});
```

## Related Rules

- [no-mixins](no-mixins.md)
