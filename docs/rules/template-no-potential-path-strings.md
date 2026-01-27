# ember/template-no-potential-path-strings

<!-- end auto-generated rule header -->

Disallow potential path strings that should be dynamic values in templates.

## Rule Details

It might happen sometimes that `{{` and `}}` are forgotten when invoking a component, and the string that is passed was actually supposed to be a property path or argument.

This rule warns about attribute values and text content that look like they should be dynamic paths. Specifically, it catches:

- **Attribute values** that start with `this.` or `@` (e.g. `<img src="this.picture">` or `<img src="@img">`)
- **Text content** that contains path-like strings (e.g. `<div>this.propertyName</div>` or `<div>foo.bar</div>`)

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <img src="this.picture">
</template>
```

```gjs
<template>
  <img src="@img">
</template>
```

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
  <img src={{this.picture}}>
</template>
```

```gjs
<template>
  <img src={{@img}}>
</template>
```

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
