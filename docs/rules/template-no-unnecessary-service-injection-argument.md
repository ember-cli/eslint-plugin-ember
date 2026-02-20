# ember/template-no-unnecessary-service-injection-argument

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

- [eslint-plugin-ember template-no-unnecessary-service-injection-argument](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-unnecessary-service-injection-argument.md)
