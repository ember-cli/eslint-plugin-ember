# no-translation-key-interpolation

Using string interpolation for constructing translation keys makes it difficult to search for them to determine where and if they are used.

## Rule Details

This rule disallows string interpolation for constructing translation keys, particularly with calls to the [ember-intl] service `t` helper.

## Examples

Examples of **incorrect** code for this rule:

```js
this.intl.t(`key.${variable}`);
```

Examples of **correct** code for this rule:


```js
this.intl.t('some.translation.key');
```

```js
function getStatusString(status) {
  switch (status) {
    case Status.INVALID_EMAIL:
      return this.intl.t('error.email');
    case Status.INVALID_PHONE:
      return this.intl.t('error.phone');
    default:
      return this.intl.t('error.unknown');
  }
}
```

## Configuration

This rule takes an optional object containing:

* `string` -- `serviceName` -- optional override for service name to look for (default is `intl`)

## References

* [Service API](https://ember-intl.github.io/ember-intl/versions/v4.0.0/docs/guide/ember-service-api) for [ember-intl]

[ember-intl]: https://github.com/ember-intl/ember-intl