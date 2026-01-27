# ember/template-no-potential-path-strings

<!-- end auto-generated rule header -->

Disallow potential path strings that should be dynamic values in templates.

## Rule Details

This rule catches potential path strings in text nodes that should likely be dynamic values.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div>this.propertyName</div>
</template>
```

```gjs
<template>
  <div>foo.bar</div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div>{{this.propertyName}}</div>
</template>
```

```gjs
<template>
  <div>{{this.foo.bar}}</div>
</template>
```

## Migration

- Replace the surrounding `"` characters with `{{`/`}}`

## Related Rules

- [no-arguments-for-html-elements](template-no-arguments-for-html-elements.md)

## References

- [Component Arguments and HTML Attributes](https://guides.emberjs.com/release/components/component-arguments-and-html-attributes/)
