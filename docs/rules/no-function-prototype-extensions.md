### Do not use Ember's `function` prototype extensions

#### `no-function-prototype-extensions`

Use computed property syntax, observer syntax or module hooks instead of `.property()`, `.observe()` or `.on()` in Ember modules.
```js
export default Component.extend({
    // BAD
    abc: function() { /* custom logic */ }.property('xyz'),
    def: function() { /* custom logic */ }.observe('xyz'),
    ghi: function() { /* custom logic */ }.on('didInsertElement'),

    // GOOD
    abc: computed('xyz', function() { /* custom logic */ }),
    def: observer('xyz', function() { /* custom logic */ }),
    didInsertElement() { /* custom logic */ }
});
