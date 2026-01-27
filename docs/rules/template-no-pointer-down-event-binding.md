# ember/template-no-pointer-down-event-binding

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Disallows pointer down event bindings.

Pointer down events can cause accessibility issues because they don't work well with keyboard navigation. Use `click` or `keydown` events instead.

## Rule Details

This rule disallows the use of `pointerdown` events in templates.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <button {{on "pointerdown" this.handlePointerDown}}>Click</button>
</template>
```

```gjs
<template>
  <div onpointerdown={{this.handlePointerDown}}>Content</div>
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
  <button {{on "keydown" this.handleKeyDown}}>Press</button>
</template>
```

```gjs
<template>
  <div {{on "mousedown" this.handleMouseDown}}>Content</div>
</template>
```

## Migration

Replace:

```gjs
<button {{on "pointerdown" this.action}}>
```

With:

```gjs
<button {{on "click" this.action}}>
```

Or for keyboard support:

```gjs
<button {{on "click" this.action}} {{on "keydown" this.handleKey}}>
```

## References

- [ember-template-lint no-pointer-down-event-binding](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-pointer-down-event-binding.md)
- [MDN - Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)
