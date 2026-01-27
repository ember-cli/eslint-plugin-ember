# ember/template-deprecated-inline-view-helper

> **HBS Only**: This rule applies to classic `.hbs` template files only (loose mode). It is not relevant for `gjs`/`gts` files (strict mode), where these patterns cannot occur.

<!-- end auto-generated rule header -->

In Ember 1.12, support for invoking the inline View helper was deprecated.

## Rule Details

This rule flags `{{view}}` mustache or block statements that have hash pair arguments (e.g., `{{view 'foo' key=value}}`). Simple `{{view.property}}` path expressions or other usages without hash pairs are not flagged.

## Examples

This rule **forbids** the following:

```hbs
{{view 'this-is-bad' tagName='span'}}

{{#view tagName='span'}}content{{/view}}
```

This rule **allows** the following:

```hbs
{{this-is-better}}

{{qux-qaz this=good}}

<div foo={{bar}}></div>
```

## References

- More information is available at the [Deprecation Guide](http://emberjs.com/deprecations/v1.x/#toc_ember-view).
