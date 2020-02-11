# no-function-prototype-extensions

Do not use Ember's `function` prototype extensions.

Use computed property syntax, observer syntax or module hooks instead of `.property()`, `.observes()` or `.on()` in Ember modules.

## Examples

Examples of **incorrect** code for this rule:

```javascript
export default Component.extend({
    abc: function() { /* custom logic */ }.property('xyz'),
    def: function() { /* custom logic */ }.observes('xyz'),
    ghi: function() { /* custom logic */ }.on('didInsertElement'),
});
```

Examples of **correct** code for this rule:

```js
export default Component.extend({
    abc: computed('xyz', function() { /* custom logic */ }),
    def: observer('xyz', function() { /* custom logic */ }),
    didInsertElement() { /* custom logic */ }
});
```
