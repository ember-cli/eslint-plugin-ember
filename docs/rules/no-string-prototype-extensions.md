# no-string-prototype-extensions

✅ The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

By default, Ember extends certain native JavaScript objects with additional methods. This can lead to problems in some situations. One example is relying on these methods in an addon that is used inside an app that has the extensions disabled.

The prototype extensions for the `String` object were deprecated in [RFC #236](https://rfcs.emberjs.com/id/0236-deprecation-ember-string/).

## Rule Details

This rule will disallow method calls that match any of the forbidden `String` prototype extension method names.

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

- [Ember prototype extensions documentation](https://guides.emberjs.com/release/configuring-ember/disabling-prototype-extensions/)
- [Ember String prototype extensions deprecation RFC](https://rfcs.emberjs.com/id/0236-deprecation-ember-string/)

## Related Rules

- [no-array-prototype-extensions](no-array-prototype-extensions.md)
- [no-function-prototype-extensions](no-function-prototype-extensions.md)
