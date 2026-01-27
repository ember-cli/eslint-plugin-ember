# ember/template-no-unsupported-role-attributes

<!-- end auto-generated rule header -->

Disallows ARIA attributes that are not supported by the element's role.

Different ARIA roles support different sets of ARIA attributes. Using unsupported attributes can cause confusion and doesn't provide the intended accessibility benefits.

## Rule Details

This rule checks elements with specific ARIA roles and ensures they only use supported ARIA attributes for that role.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div role="button" aria-checked="true">Button</div>
</template>
```

```gjs
<template>
  <div role="checkbox" aria-pressed="false">Checkbox</div>
</template>
```

```gjs
<template>
  <div role="tab" aria-valuenow="1">Tab</div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div role="button" aria-pressed="true">Toggle Button</div>
</template>
```

```gjs
<template>
  <div role="checkbox" aria-checked="false">Accept Terms</div>
</template>
```

```gjs
<template>
  <div role="tab" aria-selected="true">Home Tab</div>
</template>
```

## References

- [ARIA Roles](https://www.w3.org/TR/wai-aria-1.2/#role_definitions)
- [ARIA States and Properties](https://www.w3.org/TR/wai-aria-1.2/#state_prop_def)
- [eslint-plugin-ember template-no-unsupported-role-attributes](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-unsupported-role-attributes.md)
