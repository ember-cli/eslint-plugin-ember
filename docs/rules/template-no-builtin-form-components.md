# ember/template-no-builtin-form-components

<!-- end auto-generated rule header -->

Disallows usage of built-in form components.

## Rule Details

Built-in Ember components like `<Input>` and `<Textarea>` should be replaced with native HTML elements for better performance and simpler code.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <Input @type="text" />
</template>
```

```gjs
<template>
  <Textarea @value={{this.text}} />
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <input type="text" />
</template>
```

```gjs
<template>
  <textarea></textarea>
</template>
```

## References

- [eslint-plugin-ember no-builtin-form-components](https://github.com/eslint-plugin-ember/eslint-plugin-ember/blob/master/docs/rule/no-builtin-form-components.md)
