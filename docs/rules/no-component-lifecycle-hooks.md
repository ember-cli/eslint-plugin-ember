# no-component-lifecycle-hooks

✅ The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

Disallow usage of "classic" ember component lifecycle hooks.

## Rule Details

As most component lifecycle hooks are gone in glimmer components, this rule aims to:

- remind the developer that classic Ember component lifecycle hooks no longer exist in glimmer components
- encourage migrating away from classic Ember component lifecycle hooks in classic ember components

Custom functional modifiers or @ember/render-modifiers should be used instead.

## Examples

Examples of **incorrect** code for this rule:

```js
import Component from '@ember/component';

export default class MyComponent extends Component {
  // Classic Ember component lifecycle hooks (minus willDestroy which is also a Glimmer component lifecycle hook):
  didDestroyElement() {}
  didInsertElement() {}
  didReceiveAttrs() {}
  didRender() {}
  didUpdate() {}
  didUpdateAttrs() {}
  willClearRender() {}
  willDestroyElement() {}
  willInsertElement() {}
  willRender() {}
  willUpdate() {}
}
```

```js
import GlimmerComponent from '@glimmer/component';

export default class MyComponent extends GlimmerComponent {
  didInsertElement() {} // This is a classic Ember component lifecycle hook which can't be used in a Glimmer component.
}
```

Examples of **correct** code for this rule:

```js
import Component from '@ember/component';

export default class MyComponent extends Component {
  init(...args) {
    this._super(...args);
  }
  willDestroy() {} // Both a classic and Glimmer component lifecycle hook
}
```

```js
import GlimmerComponent from '@glimmer/component';

export default class MyComponent extends GlimmerComponent {
  // Glimmer component lifecycle hooks:
  constructor(...args) {
    super(...args);
  }
  willDestroy() {}
}
```

## Further Reading

- [`@ember/render-modifiers`](https://github.com/emberjs/ember-render-modifiers)
- [Blog post about modifiers](https://blog.emberjs.com/2019/03/06/coming-soon-in-ember-octane-part-4.html)
- [Classic component lifecycle hooks](https://guides.emberjs.com/v3.4.0/components/the-component-lifecycle/#toc_order-of-lifecycle-hooks-called)
- [Glimmer component lifecycle hooks](https://guides.emberjs.com/release/upgrading/current-edition/glimmer-components/#toc_lifecycle-and-properties)
