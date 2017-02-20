## Don't use `.on()` calls as components values

### Rule name: `no-on-calls-in-components`

Prevents using `.on()` in favour of component's lifecycle hooks.

```javascript
export default Component.extend({
  // BAD
  abc: on('didInsertElement', function () { /* custom logic */ }),

  // GOOD
  didInsertElement() { /* custom logic */ }
});
```
