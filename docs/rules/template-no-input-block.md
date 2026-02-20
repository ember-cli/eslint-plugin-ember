# ember/template-no-input-block

<!-- end auto-generated rule header -->

Use of the block form of the handlebars `input` helper will result in an error at runtime.

## Examples

This rule **forbids** the following:

```hbs
{{#input}}Some Content{{/input}}
```

This rule **allows** the following:

```hbs
{{input type='text' value=this.firstName disabled=this.entryNotAllowed size='50'}}
```

## References

- [Ember api/input component](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/Input?anchor=Input)
- [rfcs/built in components](https://emberjs.github.io/rfcs/0459-angle-bracket-built-in-components.html)
