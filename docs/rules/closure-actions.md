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

```hbs
{{! GOOD }}
{{pretty-component boom=(action 'detonate')}}
```

```javascript
export default Component.extend({
  actions: {
    pushLever() {
      this.attr.boom();
    }
  }
})
```

```hbs
{{! BAD }}
{{awful-component detonate='detonate'}}
```
```javascript
export default Component.extend({
  actions: {
    pushLever() {
      this.sendAction('detonate');
    }
  }
})
```
