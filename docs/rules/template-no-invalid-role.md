# ember/template-no-invalid-role

<!-- end auto-generated rule header -->

Disallows invalid ARIA roles in templates.

ARIA roles must be valid according to the ARIA specification. Using invalid roles can confuse assistive technologies and reduce accessibility.

## Rule Details

This rule checks that all `role` attributes contain valid ARIA role values. It also disallows `role="presentation"` and `role="none"` on semantic HTML elements, as doing so strips meaning from elements that inherently convey information.

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
  <button role="presentation">Content</button>
</template>
```

```gjs
<template>
  <nav role="none">Navigation</nav>
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
  <div role="presentation">Decorative</div>
</template>
```

```gjs
<template>
  <div>No role attribute</div>
</template>
```

## Migration

* If violations are found, remediation should be planned to replace the semantic HTML with the `div` element. Additional CSS will likely be required.

## Options

| Name                    | Type      | Default | Description                                                   |
| ----------------------- | --------- | ------- | ------------------------------------------------------------- |
| `catchNonexistentRoles` | `boolean` | `true`  | When `true`, reports roles that don't exist in the ARIA spec. |

## References

- [eslint-plugin-ember template-no-invalid-role](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-invalid-role.md)
- [WAI-ARIA Roles](https://www.w3.org/TR/wai-aria-1.2/#role_definitions)
