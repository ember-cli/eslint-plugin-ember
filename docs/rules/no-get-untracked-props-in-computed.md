# Do not reference property in Computed's body that is not in dependent keys

## Rule name: `no-get-untracked-props-in-computed`

When using computed properties, you should always put any property you reference inside a computed's body in it's dependent keys.

```js
export default Component.extend({
    // BAD
    abc: computed('propA', function() {
      return this.get('propA') + this.get('propB');
    }),

    // GOOD
    abc: computed('propA', 'propB', function() {
      return this.get('propA') + this.get('propB');
    }),
});
```