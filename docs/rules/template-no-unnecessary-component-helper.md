# ember/template-no-unnecessary-component-helper

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

✅ The `extends: 'plugin:ember/strict-gjs'` and `extends: 'plugin:ember/strict-gts'` property in a configuration file enables this rule.

Disallow unnecessary usage of the `{{component}}` helper with static component names.

## Rule Details

This rule disallows using `{{component "component-name"}}` when you could use angle bracket invocation instead.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{component "my-component"}}
</template>

<template>
  {{component "MyComponent" arg="value"}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <MyComponent />
</template>

<template>
  {{component this.dynamicComponentName}}
</template>

<template>
  {{component @componentName}}
</template>
```

## References

- [Ember Guides - Components](https://guides.emberjs.com/release/components/)
- [RFC #311 - Angle Bracket Invocation](https://github.com/emberjs/rfcs/blob/master/text/0311-angle-bracket-invocation.md)
