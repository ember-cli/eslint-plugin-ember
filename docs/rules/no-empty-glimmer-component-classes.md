# ember/no-empty-glimmer-component-classes

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

This rule will catch and prevent the use of empty backing classes for Glimmer components.

## Rule Details

This rule aims to disallow the use of empty backing classes for Glimmer components when possible including only using ember template tags in your Glimmer component. Template-only Glimmer components where there is no backing class are much faster and lighter-weight than Glimmer components with backing classes, which are much lighter-weight than Ember components. Therefore, you should only have a backing class for a Glimmer component when absolutely necessary. An exception to this case is if you need the component to be generic over part of its type signature.

To fix violations of this rule:

- In apps: Remove the backing class entirely until it is actually needed.
- In in-repo addons: Replace the backing class depending on what the host app is doing. That is, if `template-only-glimmer-components` is enabled, remove the backing class. Otherwise, replace it with a `templateOnly` export.
- In other addons: Replace the backing class with a `templateOnly` export. This is necessary because you can't assume `template-only-glimmer-components` is enabled.

## Examples

Examples of **incorrect** code for this rule:

```js
import Component from '@glimmer/component';

class MyComponent extends Component {}
```

```js
import Component from '@glimmer/component';

export default class MyComponent extends Component {
  <template>Hello World!</template>
}
```

```ts
import Component from '@glimmer/component';

export interface TypeSig {}

export default class MyComponent extends Component<TypeSig> {}
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

const MyComponent = templateOnly();

export default MyComponent;
```

```js
import Component from '@glimmer/component';
import MyDecorator from 'my-decorator';

@MyDecorator
class MyComponent extends Component {}
```

```js
import Component from '@glimmer/component';

export default class MyComponent extends Component {
  foo() {
    return this.args.bar + this.args.baz;
  }

  <template>Hello World!</template>
}
```

```ts
import Component from '@glimmer/component';

export interface SomeSig {}
export interface SomeOtherSig {}

export default class MyComponent<SomeSig> extends Component<SomeOtherSig> {}
```

## References

- [Glimmer Components - Octane Upgrade Guide](https://guides.emberjs.com/release/upgrading/current-edition/glimmer-components/)
- [Glimmer Components RFC](https://emberjs.github.io/rfcs/0416-glimmer-components.html)
- [First-Class Component Templates RFC](https://rfcs.emberjs.com/id/0779-first-class-component-templates/)
