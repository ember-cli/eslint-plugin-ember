# no-computed-properties-in-native-classes

:car: The `"extends": "plugin:ember/octane"` property in a configuration file enables this rule.

Since the beginning of Ember's existence, Computed Properties (CPs) have been used to accomplish reactivity in the framework. With Ember Octane, new features were introduced including Glimmer components, native JavaScript classes and Tracked Properties. With Ember Octane's new programming model, CPs are no longer needed. If using native JavaScript classes, Tracked Properties should be used instead as they give us the same benefit of CPs but with less boilerplate and more flexibility.

## Rule Details

This rule disallows using computed properties with native classes.

## Examples

Examples of **incorrect** code for this rule:

```js
import Component from '@ember/component';
import { and, or, alias } from '@ember/object/computed';

export default class MyComponent extends Component {
  // ...
}
```

```js
import Component from '@ember/component';
import { computed } from '@ember/object';

export default class MyComponent extends Component {
  // ...
}
```

Examples of **correct** code for this rule:

```js
import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({});
```

```js
import { alias, or, and } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({});
```

```js
// Allowed if `ignoreClassic` option is enabled.
import { computed } from '@ember/object';
import { alias, or, and } from '@ember/object/computed';
import Component from '@ember/component';
import classic from 'ember-classic-decorator';

@classic
export default class MyComponent extends Component {}
```

```js
import { tracked } from '@glimmer/tracking';
import Component from '@ember/component';

export default class MyComponent extends Component {}
```

## Configuration

This rule takes an optional object containing:

* `boolean` -- `ignoreClassic` -- whether the rule should ignore usage inside of native classes labeled with `@classic` (default `true`)

## References

* [Ember Guides: Tracked Properties](https://octane-guides-preview.emberjs.com/release/state-management/tracked-properties/)
* [Tracked Properties Deep Dive](https://www.pzuraq.com/coming-soon-in-ember-octane-part-3-tracked-properties/)
* [ember-native-class-codemod](https://github.com/ember-codemods/ember-native-class-codemod)
* [ember-classic-decorator](https://github.com/emberjs/ember-classic-decorator)
