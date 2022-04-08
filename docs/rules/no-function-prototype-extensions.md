# no-function-prototype-extensions

✅ The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

Do not use Ember's `function` prototype extensions.

Use computed property syntax, observer syntax or module hooks instead of `.property()`, `.observes()` or `.on()` in Ember modules.

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

## Related Rules

* [no-array-prototype-extensions](no-array-prototype-extensions.md)
* [no-string-prototype-extensions](no-string-prototype-extensions.md)
