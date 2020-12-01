# no-string-prototype-extensions

:white_check_mark: The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

Ember by default extends certain native JavaScript objects with additional
methods. This can lead to problems in certain situations. One example is relying
on these methods in addons, but that addon being used in an app that has the
extensions disabled.

Additionally, the prototype extensions for the `String` object have been
deprecated in [RFC #236](http://emberjs.github.io/rfcs/0236-deprecation-ember-string.html).

## Rule Details

This rule will look for method calls that match any of the forbidden `String`
prototype extension methods.

## Examples

Examples of **incorrect** code for this rule:

```js
'myString'.dasherize();
```

```js
someString.capitalize();
```

```js
'<b>foo</b>'.htmlSafe();
```

Examples of **correct** code for this rule:

```js
dasherize('myString');
```

```js
capitalize(someString);
```

```js
htmlSafe('<b>foo</b>');
```

## Migration

Replace e.g.:

```js
'myString'.dasherize();
```

with:

```js
import { dasherize } from '@ember/string';

dasherize('myString');
```

## References

* [Prototype extensions documentation](https://guides.emberjs.com/release/configuring-ember/disabling-prototype-extensions/)
* [String prototype extensions deprecation RFC](http://emberjs.github.io/rfcs/0236-deprecation-ember-string.html#string-prototype-extensions)
