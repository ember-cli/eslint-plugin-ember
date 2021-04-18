# closure-actions

:white_check_mark: The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

Always use closure actions (according to DDAU convention). Exception: only when you need bubbling.

## Examples

```js
export default Controller.extend({
  actions: {
    detonate() {
      alert('Kabooom');
    }
  }
});
```

Examples of **incorrect** code for this rule:

```hbs
{{awful-component detonate='detonate'}}
```

```js
// awful-component.js
export default Component.extend({
  actions: {
    pushLever() {
      this.sendAction('detonate');
    }
  }
});
```

Examples of **correct** code for this rule:

```hbs
{{pretty-component boom=(action 'detonate')}}
```

```js
// pretty-component.js
export default Component.extend({
  actions: {
    pushLever() {
      this.boom();
    }
  }
});
```

## References

* [RFC](https://github.com/emberjs/rfcs/blob/master/text/0335-deprecate-send-action.md) to deprecate `sendAction`
