# ember/template-no-redundant-fn

<!-- end auto-generated rule header -->

Disallows unnecessary usage of the `{{fn}}` helper.

When `{{fn}}` is used with only a function reference and no arguments to curry, it's redundant. You can pass the function directly.

## Rule Details

This rule detects when `{{fn}}` is called with only one argument (the function itself) and no curried arguments.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <button {{on "click" (fn this.handleClick)}}>Click</button>
</template>
```

```gjs
<template>
  <Component @action={{fn this.save}} />
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <button {{on "click" this.handleClick}}>Click</button>
</template>
```

```gjs
<template>
  <button {{on "click" (fn this.handleClick arg)}}>Click</button>
</template>
```

```gjs
<template>
  <Component @action={{this.save}} />
</template>
```

## Migration

Replace:

```gjs
<button {{on "click" (fn this.action)}}>
```

With:

```gjs
<button {{on "click" this.action}}>
```

## References

- [eslint-plugin-ember template-no-redundant-fn](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-redundant-fn.md)
