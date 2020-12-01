# no-empty-glimmer-component-classes

:white_check_mark: The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

This rule will catch and prevent the use of empty backing classes for Glimmer components.

## Rule Details

This rule aims to disallow the use of empty backing classes for Glimmer components when possible. Template-only Glimmer components where there is no backing class are much faster and lighter-weight than Glimmer components with backing classes, which are much lighter-weight than Ember components. Therefore, you should only have a backing class for a Glimmer component when absolutely necessary.

In addons, the empty class should be replaced with a `templateOnly` export. This is because addons can't assume `template-only-glimmer-components` is enabled. In apps, remove the backing class entirely until it is actually needed.

## Examples

Examples of **incorrect** code for this rule:

```js
import Component from '@glimmer/component';

class MyComponent extends Component {}
```

Examples of **correct** code for this rule:

```js
import Component from '@glimmer/component';

class MyComponent extends Component {
  foo() {
    return this.args.bar + this.args.baz;
  }
}
```

```js
import templateOnly from '@ember/component/template-only';

export default templateOnly();
```

## References

* [Glimmer Components - Octane Upgrade Guide](https://guides.emberjs.com/release/upgrading/current-edition/glimmer-components/)
* [Glimmer Components RFC](https://emberjs.github.io/rfcs/0416-glimmer-components.html)
