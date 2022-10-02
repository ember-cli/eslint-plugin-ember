# no-function-prototype-extensions

✅ The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

By default, Ember extends certain native JavaScript objects with additional methods. This can lead to problems in some situations. One example is relying on these methods in an addon that is used inside an app that has the extensions disabled.

The prototype extensions for the `function` object were deprecated in [RFC #272](https://rfcs.emberjs.com/id/0272-deprecation-native-function-prototype-extensions).

Use computed property syntax, observer syntax, or module hooks instead of `.property()`, `.observes()` or `.on()` in Ember modules.

## Rule Details

This rule will disallow method calls that match any of the forbidden `function` prototype extension method names.

## Examples

Examples of **incorrect** code for this rule:

```js
export default Component.extend({
  abc: function () {
    /* custom logic */
  }.property('xyz'),
  def: function () {
    /* custom logic */
  }.observes('xyz'),
  ghi: function () {
    /* custom logic */
  }.on('didInsertElement')
});
```

Examples of **correct** code for this rule:

```js
export default Component.extend({
  abc: computed('xyz', function () {
    /* custom logic */
  }),
  def: observer('xyz', function () {
    /* custom logic */
  }),
  didInsertElement() {
    /* custom logic */
  }
});
```

## References

- [Ember prototype extensions documentation](https://guides.emberjs.com/release/configuring-ember/disabling-prototype-extensions/)
- [Ember function prototype extensions deprecation RFC](https://rfcs.emberjs.com/id/0272-deprecation-native-function-prototype-extensions)

## Related Rules

- [no-array-prototype-extensions](no-array-prototype-extensions.md)
- [no-string-prototype-extensions](no-string-prototype-extensions.md)
