# ember/template-no-class-bindings

<!-- end auto-generated rule header -->

> **HBS Only**: This rule applies to classic `.hbs` template files only (loose mode). It is not relevant for `gjs`/`gts` files (strict mode), where these patterns cannot occur.

Disallow passing `classBinding` or `classNameBindings` as arguments within templates. These are legacy Ember Classic patterns that should be replaced with modern approaches.

## Examples

This rule **forbids** the following:

```hbs
<SomeThing @classBinding='isActive:active' />
```

```hbs
{{some-thing classNameBindings='isActive:active:inactive'}}
```

```hbs
<SomeThing @classNameBindings='isActive:active:inactive' />
```

This rule **allows** the following:

```hbs
<SomeThing class={{if this.isActive 'active'}} />
```

```hbs
<SomeThing />
```

## Migration

- find in templates and remove `classBinding` and/or `classNameBindings`.

## References

- [ember-template-lint no-class-bindings](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-class-bindings.md)
