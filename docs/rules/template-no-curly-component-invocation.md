# ember/template-no-curly-component-invocation

<!-- end auto-generated rule header -->

✅ The `extends: 'plugin:ember/strict-gjs'` and `extends: 'plugin:ember/strict-gts'` property in a configuration file enables this rule.

Disallow curly bracket component invocation syntax. Use angle bracket invocation instead.

## Rule Details

This rule disallows the use of curly bracket syntax for component invocation (`{{my-component}}`), encouraging the use of angle bracket syntax (`<MyComponent />`) instead.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{my-component}}
</template>

<template>
  {{MyComponent arg="value"}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <MyComponent />
</template>

<template>
  <my-component @arg="value" />
</template>

<template>
  {{some-helper "argument"}}
</template>
```

## References

- [Ember Octane Guide - Components](https://guides.emberjs.com/release/components/)
- [RFC #311 - Angle Bracket Invocation](https://github.com/emberjs/rfcs/blob/master/text/0311-angle-bracket-invocation.md)
