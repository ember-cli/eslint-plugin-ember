## Closure Actions
### Rule name: `closure-actions`

Always use closure actions (according to DDAU convention). Exception: only when you need bubbling.

```javascript
export default Controller.extend({
  actions: {
    detonate() {
      alert('Kabooom');
    }
  }
});
```

### GOOD
```hbs

{{pretty-component boom=(action 'detonate')}}
```

```javascript
// pretty-component.js
export default Component.extend({
  actions: {
    pushLever() {
      this.boom();
    }
  }
})
```

### BAD
```hbs
{{awful-component detonate='detonate'}}
```

```javascript
// awful-component.js
export default Component.extend({
  actions: {
    pushLever() {
      this.sendAction('detonate');
    }
  }
})
```

### References

* [RFC](https://github.com/emberjs/rfcs/blob/master/text/0335-deprecate-send-action.md) to deprecate `sendAction`
