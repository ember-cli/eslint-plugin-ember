# ember/template-no-trailing-spaces

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallow trailing whitespace at the end of lines.

## Examples

In examples below, `•` represents a trailing space character.

This rule **forbids** the following:

```hbs
<div>test</div>••
•••••
```

```gjs
<template>
  <div>Hello</div>••
</template>
```

This rule **allows** the following:

```hbs
<div>test</div>
```

```gjs
<template>
  <div>Hello</div>
</template>
```

## Related Rules

- [no-trailing-spaces](https://eslint.org/docs/rules/no-trailing-spaces) from eslint

## References

- [git/formatting and whitespace](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration#_formatting_and_whitespace)
