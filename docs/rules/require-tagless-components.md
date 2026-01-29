# ember/require-tagless-components

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Disallows using the wrapper element of a component.

Ember allows you to disable the wrapper element on a component (turning it into a "tagless" component). This is now the preferred style and the _only_ style allowed with Glimmer components.

## Rule Details

Instead of having the wrapper element implicitly defined by the component, all DOM elements should be represented in the component's template.

## Examples

Examples of **incorrect** code for this rule:

```js
// "Classic"-class Ember components that have the default `tagName` of `div`
import Component from '@ember/component';

export default Component.extend({});
```

```js
// "Classic"-class Ember components that have a `tagName` configured to something besides `''`
import Component from '@ember/component';

export default Component.extend({
  tagName: 'span',
});
```

```js
// "Native"-class Ember components that have the default `tagName` of `div`
import Component from '@ember/component';

export default class MyComponent extends Component {}
```

```js
// "Native"-class Ember components that have a `tagName` configured to something besides `''`
import Component from '@ember/component';

export default class MyComponent extends Component {
  tagName = 'span';
}
```

```js
// "Native"-class Ember components that use the `@tagName` decorator configured to something besides `''`
import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';

@tagName('span')
export default class MyComponent extends Component {}
```

Examples of **correct** code for this rule:

```js
// "Class"-class Ember components that have a `tagName` configured to `''`
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
});
```

```js
// "Native"-class Ember components that have a `tagName` configured to `''`
import Component from '@ember/component';

export default class MyComponent extends Component {
  tagName = '';
}
```

```js
// "Native"-class Ember components that use the `@tagName` decorator configured `''`
import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';

@tagName('')
export default class MyComponent extends Component {}
```

```js
// Glimmer components never have a `tagName` and are always valid
import Component from '@glimmer/component';

export default class MyComponent extends Component {}
```

## Caveats

- Rule does not catch cases where a Mixin is included to configure the `tagName` property.

## Fixing This Rule

You can take two approaches to fixing this rule:

1. Convert to a Glimmer component
2. Set the `tagName` in your Ember component definition to `''` (an empty string)

Note that you might want to wrap the component template in an additional element, if the usage of the component expects the wrapping element to exist. Classes and attributes should be applied to that wrapper element, as well as forwarding any attributes assigned to the component through `...attributes`.

## When Not To Use It

- If you are not prepared to convert your components to be tag-less, wrapping the associated template in a tag and applying `...attributes` where appropriate, you should not enable this rule.

## Further Reading

- [Glimmer Components](https://glimmerjs.com/guides/components-and-actions)
  - Glimmer components are "the future" for Ember, and are _always_ tagless. Using them now, or changing your Ember components to be tagless, helps to modernize your codebase and prepare for a point in the future where components _never_ have a wrapper element.
- [RFC #311 "Angle Bracket Invocation" (HTML Attributes section)](https://emberjs.github.io/rfcs/0311-angle-bracket-invocation.html#html-attributes)
  - Discusses forwarding attributes on a component to a DOM element using `...attributes`
