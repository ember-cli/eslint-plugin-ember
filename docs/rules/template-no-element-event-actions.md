# ember/template-no-element-event-actions

<!-- end auto-generated rule header -->

Disallow using element event actions (e.g., `onclick={{action}}`) in templates. Use the `{{on}}` modifier instead.

## Rule Details

This rule disallows the use of element event actions in templates.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <button onclick={{this.handleClick}}>Click</button>
</template>
```

```gjs
<template>
  <div onmouseenter={{this.handleHover}}>Hover</div>
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
  <div {{on "mouseenter" this.handleHover}}>Hover</div>
</template>
```

## References

- [Ember Octane migration guide](https://guides.emberjs.com/release/upgrading/current-edition/action-on-and-fn/)
