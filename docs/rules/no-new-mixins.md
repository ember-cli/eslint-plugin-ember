## Don't create new Mixins

### Rule name: `no-new-mixins`

Using mixins makes sharing code simple at first, but add significant complexity as a project developes and grows larger.

For more details and examples of how mixins create problems down-the-line, see these excellent blog posts:
* [Mixins Considered Harmful](https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html)
* [Why Are Mixins Considered Harmful?](http://raganwald.com/2016/07/16/why-are-mixins-considered-harmful.html)

### Examples

Examples of **incorrect** code for this rule:

```javascript
// my-mixin.js
export default Mixin.create({
  isValidClassName(classname) {
    return !!className.match('-class');
  },

  hideModal(value) {
    this.set('isHidden', value);
  }
});

// my-component.js
import myMixin from 'my-mixin';

export default Component.extend(myMixin, {
  aComputedProperty: computed('obj', function() {
    return this.isValidClassName(get(obj, 'className'));
  }),
});
```

Examples of **correct** code for this rule:

```javascript
// my-utils.js
export function isValidClassName(classname) {
  return !!className.match('-class');
}

export function hideModal(obj, value) {
  set(obj, 'isHidden', value);
}

// my-component.js
import { isValidClassName } from 'my-utils';

export default Component.extend({
  aComputedProperty: computed('obj', function() {
    return isValidClassName(get(obj, 'className'));
  }),
});
```
