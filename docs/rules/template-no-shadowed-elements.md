# ember/template-no-shadowed-elements

<!-- end auto-generated rule header -->

Disallows component names that shadow HTML elements.

Using component names that match HTML element names can be confusing and may cause unexpected behavior. It's better to use more descriptive names that don't conflict with built-in elements.

## Rule Details

This rule disallows component names (PascalCase) that, when lowercased, match HTML element names.

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

## References

- [eslint-plugin-ember template-no-shadowed-elements](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-shadowed-elements.md)
