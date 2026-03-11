# ember/template-no-positional-data-test-selectors

<!-- end auto-generated rule header -->

Disallows positional data-test selectors.

## Rule Details

Data-test selectors should use descriptive names rather than positional indices for better maintainability and clarity.

## Motivation

[ember-test-selectors](https://github.com/simplabs/ember-test-selectors) is a very popular library that enables better element selectors for testing.

One of the features that had been added to ember-test-selectors over the years was to allow passing a positional argument to curly component invocations as a shorthand (to avoid having to also add a named argument value).

That would look like:

```hbs
{{some-thing data-test-foo}}
```

Internally, that was converted to an `attributeBinding` for `@ember/component`s. Unfortunately, that particular invocation syntax is in conflict with modern Ember Octane templates. For example, in the snippet above `data-test-foo` is actually referring to `this.data-test-foo` (and would be marked as an error by the `no-implicit-this` rule).

Additionally, the nature of these "fake" local properties significantly confuses the codemods that are used to transition an application into Ember Octane (e.g. [ember-no-implicit-this-codemod](https://github.com/ember-codemods/ember-no-implicit-this-codemod) and [ember-angle-brackets-codemod](https://github.com/ember-codemods/ember-angle-brackets-codemod)).

## Examples

This rule checks two things:

1. **Curly component invocations** with positional `data-test-*` params (e.g. `{{badge data-test-profile-card}}`), which should use named arguments instead (e.g. `data-test-profile-card=true`).
2. **HTML attribute values** that are purely numeric (e.g. `data-test-item="0"`), which should use descriptive names instead.

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{badge data-test-profile-card}}
</template>
```

```gjs
<template>
  <div data-test-item="0"></div>
</template>
```

```gjs
<template>
  <div data-test-card="1"></div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  {{badge data-test-profile-card=true}}
</template>
```

```gjs
<template>
  <div data-test-user-card></div>
</template>
```

```gjs
<template>
  <div data-test-item="my-item"></div>
</template>
```

## References

- [eslint-plugin-ember template-no-positional-data-test-selectors](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-positional-data-test-selectors.md)
