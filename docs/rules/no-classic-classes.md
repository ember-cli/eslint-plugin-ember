# no-classic-classes

:white_check_mark: The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

Disallow "classic" classes in favor of native JS classes.

Ember now allows you to use native JS classes to extend the built-in classes provided by Ember. This pattern is preferred in favor of using the "classic" style of classes that Ember has provided since before JS classes were available to use.

## Rule Details

This rule aims to ensure that you do not use a "classic" Ember class where a native class could be used instead. The one instance where `.extend` should still be used is for including a Mixin into your class, which does not have a native JS class alternative available.

## Examples

Examples of **incorrect** code for this rule:

```javascript
// Extending an Ember class using the "classic" class pattern is not OK
import Component from '@ember/component';

export default Component.extend({});
```

```javascript
// With option: additionalInvalidImports = ['my-custom-addon']
import CustomClass from 'my-custom-addon';

export default CustomClass.extend({});
```

Examples of **correct** code for this rule:

```javascript
// Extending using a native JS class is OK
import Component from '@ember/component';

export default class MyComponent extends Component {}
```

```javascript
// Including a Mixin is OK
import Component from '@ember/component';
import Evented from '@ember/object/evented';

export default class MyComponent extends Component.extend(Evented) {}
```

## Configuration

This rule takes an optional object containing:

- `string[]` -- `additionalClassImports` -- Allows you to specify additional imports that should be flagged to disallow calling `extend` on. This allows you to handle the case where your app or addon is importing from a module that performs the `extend`.

## When Not To Use It

- If you are not ready to transition completely to native JS classes, you should not enable this rule

## Further Reading

- [Ember Octane Release Plan](https://blog.emberjs.com/2019/08/15/octane-release-plan.html)
  - Includes advice on transition Components to use native, rather than classic, classes
- [Ember.js Native Class Update - 2019 Edition](https://blog.emberjs.com/2019/01/26/emberjs-native-class-update-2019-edition.html)
  - **Note:** some of the recommendations made in this blog post are longer relevant, such as using `.extend` when defining a computed property
