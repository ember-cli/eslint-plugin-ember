# ember/template-no-invalid-role

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Disallows invalid ARIA roles in templates.

ARIA roles must be valid according to the ARIA specification. Using invalid roles can confuse assistive technologies and reduce accessibility.

## Rule Details

This rule checks that all `role` attributes contain valid ARIA role values.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div role="invalid">Content</div>
</template>
```

```gjs
<template>
  <div role="btn">Should be "button"</div>
</template>
```

```gjs
<template>
  <div role="fake-role">Content</div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div role="button">Content</div>
</template>
```

```gjs
<template>
  <div role="navigation">Nav</div>
</template>
```

```gjs
<template>
  <div role="main">Main content</div>
</template>
```

```gjs
<template>
  <div>No role attribute</div>
</template>
```

## References

- [ember-template-lint no-invalid-role](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-invalid-role.md)
- [WAI-ARIA Roles](https://www.w3.org/TR/wai-aria-1.2/#role_definitions)
