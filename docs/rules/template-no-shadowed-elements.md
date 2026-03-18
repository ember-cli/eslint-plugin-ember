# ember/template-no-shadowed-elements

<!-- end auto-generated rule header -->

Disallows usage patterns where component or block param names shadow built-in HTML elements, creating ambiguity.

## Rule Details

This rule prevents two kinds of shadowing:

1. **PascalCase components that shadow HTML elements** -- In `.gjs`/`.gts` files, a component like `<Form>` shadows the built-in `<form>` element. Use a more descriptive name instead.
2. **Block params that shadow HTML elements** -- When a yielded block param has the same name as an HTML element (e.g. `as |div|`), using `<div>` inside that block is ambiguous. Use a different block param name instead.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <Form>Content</Form>
</template>
```

```gjs
<template>
  <Input @type="text" />
</template>
```

```gjs
<template>
  <Select @options={{this.options}} />
</template>
```

```gjs
<template>
  <FooBar as |div|>
    <div></div>
  </FooBar>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <CustomForm>Content</CustomForm>
</template>
```

```gjs
<template>
  <TextInput @type="text" />
</template>
```

```gjs
<template>
  <SelectBox @options={{this.options}} />
</template>
```

```gjs
<template>
  <form>Regular HTML form</form>
</template>
```

```gjs
<template>
  <FooBar as |Baz|>
    <Baz />
  </FooBar>
</template>
```

```gjs
<template>
  <Foo as |bar|>
    <bar.baz />
  </Foo>
</template>
```

## References

- [eslint-plugin-ember template-no-shadowed-elements](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-shadowed-elements.md)
- [Ember guides/block content](https://guides.emberjs.com/release/components/block-content/)
