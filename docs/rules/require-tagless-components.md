# Disallows using the wrapper element of a Component (require-tagless-components)

Ember allows you to disable the wrapper element on a component (turning it into a "tagless" component). This is now the preferred style and the _only_ style allowed with Glimmer components.

## Rule Details

Instead of having the wrapper element implicitly defined by the component, all DOM elements should be represented in the component's template.

Examples of **incorrect** code for this rule:

```javascript
// "Classic"-class Ember components that have the default `tagName` of `div`
import Component from '@ember/component';

export default Component.extend({});
```

```javascript
// "Classic"-class Ember components that have a `tagName` configured to something besides `''`
import Component from '@ember/component';

export default Component.extend({
  tagName: 'span'
});
```

```javascript
// "Native"-class Ember components that have the default `tagName` of `div`
import Component from '@ember/component';

export default class MyComponent extends Component {}
```

```javascript
// "Native"-class Ember components that have a `tagName` configured to something besides `''`
import Component from '@ember/component';

export default class MyComponent extends Component {
  tagName = 'span'
}
```

```javascript
// "Native"-class Ember components that use the `@tagName` decorator configured to something besides `''`
import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';

@tagName('span')
export default class MyComponent extends Component {}
```

Examples of **correct** code for this rule:

```javascript
// "Class"-class Ember components that have a `tagName` configured to `''`
import Component from '@ember/component';

export default Component.extend({
  tagName: ''
});
```

```javascript
// "Native"-class Ember components that have a `tagName` configured to `''`
import Component from '@ember/component';

export default class MyComponent extends Component {
  tagName = ''
}
```

```javascript
// "Native"-class Ember components that use the `@tagName` decorator configured `''`
import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';

@tagName('')
export default class MyComponent extends Component {}
```

```javascript
// Glimmer components never have a `tagName` and are always valid
import Component from '@glimmer/component';

export default class MyComponent extends Component {}
```

### Caveats

* Rule does not catch cases where a Mixin is included to configure the `tagName` property.
* Rule does not catch cases where a decorator is applied to configure the `tagName` property.

## Fixing This Rule

You can take two approaches to fixing this rule:

1. Convert to a Glimmer component
2. Set the `tagName` in your Ember component definition to `''` (an empty string)

Note that you might want to wrap the component template in an additional element, if the usage of the component expects the wrapping element to exist. Classes and attributes should be applied to that wrapper element, as well as forwarding any attributes assigned to the component through `...attributes`.

## When Not To Use It

* If you are not prepared to convert your components to be tag-less, wrapping the associated template in a tag and applying `...attributes` where appropriate, you should not enable this rule.

## Further Reading

* [Glimmer Components](https://glimmerjs.com/guides/components-and-actions)
* [RFC #311 "Angle Bracket Invocation" (HTML Attributes section)](https://emberjs.github.io/rfcs/0311-angle-bracket-invocation.html#html-attributes)
  * Discusses forwarding attributes on a component to a DOM element using `...attributes`
