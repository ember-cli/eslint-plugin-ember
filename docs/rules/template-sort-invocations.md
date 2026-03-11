# ember/template-sort-invocations

<!-- end auto-generated rule header -->

Require sorted attributes and modifiers.

Component attributes and modifiers should be sorted in a consistent order for better readability and maintainability.

## Why use it?

The rule helps you standardize templates:

- Component invocations
- Helper invocations
- Modifier invocations

By sorting things that are order-independent, you can more easily refactor code. In addition, sorting removes style differences, so you can review another person's code more effectively.

> [!TIP]
>
> The `--fix` option for this rule doesn't preserve formatting. You can use `prettier`, [`prettier-plugin-ember-hbs-tag`](https://github.com/ijlee2/prettier-plugin-ember-hbs-tag), and [`prettier-plugin-ember-template-tag`](https://github.com/ember-tooling/prettier-plugin-ember-template-tag) to format templates in `*.hbs`, `hbs` tags, and `<template>` tags, respectively.

## Sorting Order

1. Argument attributes (starting with `@`)
2. Regular attributes
3. `...attributes` splattributes
4. Modifiers

Within each category, attributes are sorted alphabetically.

## Examples

This rule **allows** the following:

```gjs
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

## Limitations

It's intended that there are no options for sorting. Alphabetical sort is the simplest for everyone to understand and to apply across different projects. It's also the easiest to maintain.

To better meet your needs, consider creating a plugin for `ember-template-lint`.

## Known issues

1\. If you passed an empty string as an argument's value, it has been replaced with `{{""}}`. Let [`ember-template-lint`](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-unnecessary-curly-strings.md) fix the formatting change.

```diff
- <MyComponent @description={{""}} />
+ <MyComponent @description="" />
```

2\. Comments such as `{{! @glint-expect-error }}` may have shifted. Move them to the correct location.

## References

- [Ember.js Guides - Component Syntax](https://guides.emberjs.com/release/components/component-syntax-and-arguments/)
