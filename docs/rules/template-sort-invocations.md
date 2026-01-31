# ember/template-sort-invocations

<!-- end auto-generated rule header -->

Require sorted attributes and modifiers.

Component attributes and modifiers should be sorted in a consistent order for better readability and maintainability.

## Sorting Order

1. Argument attributes (starting with `@`)
2. Regular attributes
3. `...attributes` splattributes
4. Modifiers

Within each category, attributes are sorted alphabetically.

## Examples

This rule **allows** the following:

```hbs
<template>
  <Button
    @isDisabled={{true}}
    @label='Submit'
    class='button'
    {{on 'click' @onClick}}
    ...attributes
  />
</template>
```

## References

- [Ember.js Guides - Component Syntax](https://guides.emberjs.com/release/components/component-syntax-and-arguments/)
