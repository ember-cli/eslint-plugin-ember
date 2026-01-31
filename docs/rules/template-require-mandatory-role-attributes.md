# ember/template-require-mandatory-role-attributes

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Requires mandatory ARIA attributes for specific ARIA roles.

Certain ARIA roles require specific attributes to be present for the role to be properly communicated to assistive technologies. This rule ensures these mandatory attributes are provided.

## Rule Details

This rule checks that elements with ARIA roles include all required ARIA attributes for that role.

Required attributes by role:

- `checkbox`: requires `aria-checked`
- `radio`: requires `aria-checked`
- `slider`: requires `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- `spinbutton`: requires `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- `switch`: requires `aria-checked`
- `scrollbar`: requires `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-controls`
- `option`: requires `aria-selected`
- `tab`: requires `aria-selected`
- `combobox`: requires `aria-expanded`

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div role="checkbox">Accept</div>
</template>
```

```gjs
<template>
  <div role="slider">Volume</div>
</template>
```

```gjs
<template>
  <div role="switch">Dark Mode</div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div role="checkbox" aria-checked="false">Accept</div>
</template>
```

```gjs
<template>
  <div
    role="slider"
    aria-valuenow="50"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    Volume
  </div>
</template>
```

```gjs
<template>
  <div role="switch" aria-checked="true">Dark Mode</div>
</template>
```

## References

- [ARIA Roles - Required States and Properties](https://www.w3.org/TR/wai-aria-1.2/#role_definitions)
- [ember-template-lint require-mandatory-role-attributes](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/require-mandatory-role-attributes.md)
