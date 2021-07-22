# no-attrs-snapshot

✅ The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

Disallow use of attrs snapshot in `didReceiveAttrs` and `didUpdateAttrs`.

Do not use the arguments (attrs) that are passed in `didReceiveAttrs` and `didUpdateAttrs`. Using the arguments (attrs) in these hooks can result in performance degradation in your application.

## Rule Details

In 2.0.0, `didReceiveAttrs` and `didUpdateAttrs` hooks were introduced. These hooks are called whenever the references of arguments to a component change. These hooks receive arguments, however one should not use them as they force those objects to reify, which can be very costly when you have a lot of components on the page. These arguments are also purposely undocumented.

If for some reason you need to do a comparison of arguments we suggest that you simply keep a cache on the component.

## Examples

Examples of **incorrect** code for this rule:

```js
import Component from '@ember/component';

export default Component({
  init(...args) {
    this._super(...args);
    this.updated = false;
  },
  didReceiveAttrs(attrs) {
    const { newAttrs, oldAttrs } = attrs;
    if (newAttrs && oldAttrs && newAttrs.value !== oldAttrs.value) {
      this.set('updated', true);
    } else {
      this.set('updated', false);
    }
  }
});
```

Examples of **correct** code for this rule:

```js
import Component from '@ember/component';

export default Component({
  init(...args) {
    this._super(...args);
    this._valueCache = this.value;
    this.updated = false;
  },
  didReceiveAttrs() {
    if (this._valueCache !== this.value) {
      this._valueCache = this.value;
      this.set('updated', true);
    } else {
      this.set('updated', false);
    }
  }
});
```

## When Not To Use It

You can turn this rule of if you aren't worried about the negative performance impacts of using params in these hooks.

## Further Reading

- [`didReceiveAttrs`](https://guides.emberjs.com/v2.9.0/components/the-component-lifecycle/#toc_formatting-component-attributes-with-code-didreceiveattrs-code)
- [`didUpdateAttrs`](https://guides.emberjs.com/v2.9.0/components/the-component-lifecycle/#toc_resetting-presentation-state-on-attribute-change-with-code-didupdateattrs-code)
