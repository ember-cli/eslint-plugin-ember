# ember/template-no-duplicate-id

<!-- end auto-generated rule header -->

Valid HTML requires that `id` attribute values are unique.

This rule does a basic check to ensure that `id` attribute values are not the same.

## Examples

This rule **forbids** the following:

```gjs
<template><div id='id-00'></div><div id='id-00'></div></template>
```

This rule **allows** the following:

```gjs
<template><div id={{this.divId}}></div></template>
```

```gjs
<template><div id='concat-{{this.divId}}'></div></template>
```

```gjs
<template>
  <MyComponent as |inputProperties|>
    <Input id={{inputProperties.id}} />
    <div id={{inputProperties.abc}} />
  </MyComponent>

  <MyComponent as |inputProperties|>
    <Input id={{inputProperties.id}} />
  </MyComponent>
</template>
```

## Migration

For best results, it is recommended to generate `id` attribute values when they are needed, to ensure that they are not duplicates.

## References

- <https://www.w3.org/TR/2011/WD-html5-20110525/elements.html#the-id-attribute>
