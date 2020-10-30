# no-empty-glimmer-component-classes

This rule will catch and prevent the use of empty backing classes for Glimmer components.

## Rule Details

This rule aims to disallow the use of empty backing classes for Glimmer components. Template-only Glimmer components where there is no backing class are much faster and lighter-weight than Glimmer components with backing classes, which are much lighter-weight than Ember components. Therefore, you should only have a backing class for a Glimmer component when absolutely necessary. Otherwise, remove the backing class entirely until it is actually needed.

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

## References

* [Glimmer Components - Octane Upgrade Guide](https://guides.emberjs.com/release/upgrading/current-edition/glimmer-components/)
* [Glimmer Components RFC](https://emberjs.github.io/rfcs/0416-glimmer-components.html)
