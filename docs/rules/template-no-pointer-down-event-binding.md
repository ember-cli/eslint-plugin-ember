# ember/template-no-pointer-down-event-binding

<!-- end auto-generated rule header -->

Disallows pointer down event bindings (`mousedown`, `pointerdown`).

Pointer down events fire before the user releases the pointer, which can cause accessibility issues — actions triggered on down events don't allow users to cancel by moving the pointer away before releasing. Bind to the corresponding pointer up event instead.

## Rule Details

This rule disallows the use of `mousedown`, `onmousedown`, `pointerdown`, and `onpointerdown` events in templates, whether via `{{on}}`, `{{action on=...}}`, or HTML attributes.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <button {{on "mousedown" this.handleMouseDown}}>Click</button>
</template>
```

```gjs
<template>
  <div {{on "pointerdown" this.handlePointerDown}}>Content</div>
</template>
```

```gjs
<template>
  <div onmousedown={{this.handleMouseDown}}>Content</div>
</template>
```

```gjs
<template>
  <div {{action this.handler on="mousedown"}}></div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <button {{on "mouseup" this.handleMouseUp}}>Click</button>
</template>
```

```gjs
<template>
  <div {{on "pointerup" this.handlePointerUp}}>Content</div>
</template>
```

```gjs
<template>
  <button {{on "click" this.handleClick}}>Click</button>
</template>
```

## Migration

Replace:

```gjs
<button {{on "mousedown" this.action}}>
```

With:

```gjs
<button {{on "mouseup" this.action}}>
```

Or use the more modern pointer event:

```gjs
<button {{on "pointerup" this.action}}>
```

## References

- [ember-template-lint no-pointer-down-event-binding](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-pointer-down-event-binding.md)
- [MDN - Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)
- [MDN - mousedown event](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event)
