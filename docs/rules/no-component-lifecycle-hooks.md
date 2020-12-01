# no-component-lifecycle-hooks

:car: The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

Disallow usage of "classic" ember component lifecycle hooks.

## Rule Details

As most component lifecycle hooks are gone in glimmer components, this rule aims to:

- remind the developer that those hooks no longer exist in glimmer components
- encourage migrating away from those hooks in classic ember components

Effectively, this rule disallows following lifecycle hooks in components:

- `didDestroyElement`
- `didInsertElement`
- `didReceiveAttrs`
- `didRender`
- `didUpdate`
- `didUpdateAttrs`
- `willClearRender`
- `willDestroyElement`
- `willRender`

Custom functional modifiers or @ember/render-modifiers should be used instead.

## Examples

Examples of **incorrect** code for this rule:

```js
export default class MyComponent extends Component {
  didDestroyElement() {}
  didInsertElement() {}
  didReceiveAttrs() {}
  didRender() {}
  didUpdate() {}
  didUpdateAttrs() {}
  willClearRender() {}
  willDestroyElement() {}
  willRender() {}
}
```

```js
export default Component.extend({
  didDestroyElement() {},
  didInsertElement() {},
  didReceiveAttrs() {},
  didRender() {},
  didUpdate() {},
  didUpdateAttrs() {},
  willClearRender() {},
  willDestroyElement() {},
  willRender() {}
});
```

Examples of **correct** code for this rule:

```js
export default class MyComponent extends Component {
  init() {}
  willDestroy() {}
}
```

```js
export default Component.extend({
  init() {},
  willDestroy() {}
});
```

## Further Reading

- [`@ember/render-modifiers`](https://github.com/emberjs/ember-render-modifiers)
- [Blog post about modifiers](https://blog.emberjs.com/2019/03/06/coming-soon-in-ember-octane-part-4.html)
