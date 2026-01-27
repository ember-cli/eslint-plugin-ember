# ember/template-no-unknown-arguments-for-builtin-components

<!-- end auto-generated rule header -->

Disallow unknown arguments for built-in Ember components.

## Rule Details

This rule checks that only known arguments are used with built-in Ember components like `<Input>`, `<Textarea>`, and `<LinkTo>`.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <Input @unknownArg="value" />
</template>
```

```gjs
<template>
  <Textarea @invalidProp={{this.value}} />
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <Input @type="text" @value={{this.value}} />
</template>
```

```gjs
<template>
  <Textarea @value={{this.text}} rows="10" />
</template>
```

## Migration

- Check references section to get allowed arguments list.
- If argument represents html attribute, remove `@` from name.

## Related Rules

- [no-link-to-tagname](template-no-link-to-tagname.md)
- [no-input-tagname](template-no-input-tagname.md)
- [builtin-component-arguments](template-builtin-component-arguments.md)

## References

- [Ember Built-in Components](https://api.emberjs.com/ember/release/classes/Ember.Templates.components)
