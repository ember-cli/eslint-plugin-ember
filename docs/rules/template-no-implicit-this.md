# ember/template-no-implicit-this

<!-- end auto-generated rule header -->

> **HBS Only**: This rule applies to classic `.hbs` template files only (loose mode). It is not relevant for `gjs`/`gts` files (strict mode), where these patterns cannot occur.

Require explicit `this` for property access in templates to avoid ambiguity.

## Rule Details

This rule requires explicitly using `this.` prefix for component properties and `@` prefix for named arguments in templates, avoiding ambiguous property references.

## Motivation

Currently, the way to access properties on a components class is `{{greeting}}`
from a template. This works because the component class is one of the objects
we resolve against during the evaluation of the expression.

The first problem with this approach is that the `{{greeting}}` syntax is
ambiguous, as it could be referring to a local variable (block param), a helper
with no arguments, a closed over component, or a property on the component
class.

## Examples

Examples of **incorrect** code for this rule:

```hbs
{{property}}
{{someValue}}
```

Examples of **correct** code for this rule:

```hbs
{{this.property}}
{{@namedArg}}
{{yield}}
{{if this.condition 'yes' 'no'}}
```

## Migration

- use [ember-no-implicit-this-codemod](https://github.com/ember-codemods/ember-no-implicit-this-codemod)
- [upgrade to Glimmer components](https://guides.emberjs.com/release/upgrading/current-edition/glimmer-components/), which don't allow ambiguous access
  - classic components have [auto-reflection](https://github.com/emberjs/rfcs/blob/master/text/0276-named-args.md#motivation), and can use `this.myArgName` or `this.args.myArgNme` or `@myArgName` interchangeably

## References

- [Ember Octane Guide - Templates](https://guides.emberjs.com/release/components/component-state-and-actions/)
- [RFC #308 - Deprecate implicit this](https://github.com/emberjs/rfcs/blob/master/text/0308-deprecate-property-lookup-fallback.md)
