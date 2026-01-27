# ember/template-no-implicit-this

<!-- end auto-generated rule header -->

Require explicit `this` for property access in templates to avoid ambiguity.

## Rule Details

This rule requires explicitly using `this.` prefix for component properties and `@` prefix for named arguments in templates, avoiding ambiguous property references.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{property}}
</template>

<template>
  {{someValue}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  {{this.property}}
</template>

<template>
  {{@namedArg}}
</template>

<template>
  {{yield}}
</template>

<template>
  {{if this.condition "yes" "no"}}
</template>
```

## References

- [Ember Octane Guide - Templates](https://guides.emberjs.com/release/components/component-state-and-actions/)
- [RFC #308 - Deprecate implicit this](https://github.com/emberjs/rfcs/blob/master/text/0308-deprecate-property-lookup-fallback.md)
