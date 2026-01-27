# ember/template-no-down-event-binding

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Disallows mouse down and touch start event bindings.

Mouse down and touch start events can cause accessibility issues because they don't work well with keyboard navigation. Use `click` or `keydown` events instead.

## Rule Details

This rule disallows the use of `mousedown` and `touchstart` events in templates.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <button {{on "mousedown" this.handleMouseDown}}>Click</button>
</template>
```

```gjs
<template>
  <div {{on "touchstart" this.handleTouchStart}}>Content</div>
</template>
```

```gjs
<template>
  <div onmousedown={{this.handleMouseDown}}>Content</div>
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
  <div {{on "mouseup" this.handleMouseUp}}>Content</div>
</template>
```

## Migration

Replace:

```gjs
<button {{on "mousedown" this.action}}>
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

- [ember-template-lint no-down-event-binding](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-down-event-binding.md)
- [MDN - Mouse events](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)
