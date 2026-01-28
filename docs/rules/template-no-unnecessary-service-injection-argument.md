# ember/template-no-unnecessary-service-injection-argument

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Disallows unnecessary service injection arguments when the argument matches the property name.

## Rule Details

When injecting a service, the argument is unnecessary if it matches the property name.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{service "store"}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  {{this.store}}
</template>
```

```gjs
<template>
  {{service "my-custom-service"}}
</template>
```

## References

- [ember-template-lint no-unnecessary-service-injection-argument](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-unnecessary-service-injection-argument.md)
