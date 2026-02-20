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
  <Textarea @value={{this.text}} @rows="10" />
</template>
```

## References

- [Ember Built-in Components](https://api.emberjs.com/ember/release/classes/Ember.Templates.components)
