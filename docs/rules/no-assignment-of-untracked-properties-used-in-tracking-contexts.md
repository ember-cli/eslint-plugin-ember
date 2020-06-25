# no-assignment-of-untracked-properties-used-in-tracking-contexts

:wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

Ember 3.13 added an assertion that fires when using assignment `this.x = 123` on an untracked property that is used in a tracking context such as a computed property.

> You attempted to update "propertyX" to "valueY",
but it is being tracked by a tracking context, such as a template, computed property, or observer.
>
> In order to make sure the context updates properly, you must invalidate the property when updating it.
>
> You can mark the property as `@tracked`, or use `@ember/object#set` to do this.

## Rule Details

This rule catches assignments of untracked properties that are used as computed property dependency keys.

## Examples

Examples of **incorrect** code for this rule:

```js
import { computed } from '@ember/object';
import Component from '@ember/component';

class MyComponent extends Component {
  @computed('x') get myProp() {
    return this.x;
  }
  myFunction() {
    this.x = 123; // Not okay to use assignment here.
  }
}
```

Examples of **correct** code for this rule:

```js
import { computed, set } from '@ember/object';
import Component from '@ember/component';

class MyComponent extends Component {
  @computed('x') get myProp() {
    return this.x;
  }
  myFunction() {
    set(this, 'x', 123); // Okay because it uses set.
  }
}
```

```js
import { computed, set } from '@ember/object';
import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';

class MyComponent extends Component {
  @tracked x;
  @computed('x') get myProp() {
    return this.x;
  }
  myFunction() {
    this.x = 123; // Okay because `x` is a tracked property.
  }
}
```

## Migration

The autofixer for this rule will update assignments to use `set`. Alternatively, you can begin using tracked properties.

## References

* [Spec](https://api.emberjs.com/ember/release/functions/@ember%2Fobject/set) for `set()`
* [Spec](https://api.emberjs.com/ember/3.16/functions/@glimmer%2Ftracking/tracked) for `@tracked`
* [Guide](https://guides.emberjs.com/release/upgrading/current-edition/tracked-properties/) for tracked properties
