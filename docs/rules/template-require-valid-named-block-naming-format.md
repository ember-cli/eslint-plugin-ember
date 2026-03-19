# ember/template-require-valid-named-block-naming-format

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Require named blocks to use a valid naming format (`camelCase` or `kebab-case`).

The default naming format used is `camelCase`.

## Examples

This rule **forbids** the following when the `camelCase` naming format is enabled:

```gjs
<template>
  {{yield to="foo-bar"}}
  {{has-block "foo-bar"}}
  {{if (has-block "foo-bar")}}
  {{has-block-params "foo-bar"}}
  {{if (has-block-params "foo-bar")}}
</template>
```

This rule **allows** the following when the `camelCase` naming format is enabled:

```gjs
<template>
  {{yield to="fooBar"}}
  {{has-block "fooBar"}}
  {{if (has-block "fooBar")}}
  {{has-block-params "fooBar"}}
  {{if (has-block-params "fooBar")}}
</template>
```

This rule **forbids** the following when the `kebab-case` naming format is enabled:

```gjs
<template>
  {{yield to="fooBar"}}
  {{has-block "fooBar"}}
  {{if (has-block "fooBar")}}
  {{has-block-params "fooBar"}}
  {{if (has-block-params "fooBar")}}
</template>
```

This rule **allows** the following when the `kebab-case` naming format is enabled:

```gjs
<template>
  {{yield to="foo-bar"}}
  {{has-block "foo-bar"}}
  {{if (has-block "foo-bar")}}
  {{has-block-params "foo-bar"}}
  {{if (has-block-params "foo-bar")}}
</template>
```

## Configuration

- boolean -- `true` enables the rule with the default `camelCase` format and `false`
  disables it
- string -- `"camelCase"` requires the use of the `camelCase` naming format, and
  `"kebab-case"` requires the use of the `kebab-case` naming format

## References

- [Naming convention (programming)](<https://en.wikipedia.org/wiki/Naming_convention_(programming)>)
