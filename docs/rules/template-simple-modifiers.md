# ember/template-simple-modifiers

💼 This rule is enabled in the 📋 `template-lint-migration` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Require simple modifier syntax.

This rule strongly advises against passing complex statements or conditionals to the
first argument of the `{{modifier}}` helper. Instead, the first argument should be
either:

- a string literal such as `{{(modifier "track-interaction")}}`
- a path expression such as `{{(modifier this.trackInteraction)}}`

A common issue this rule catches is declaring the modifier name conditionally, which
works because `modifier` ignores `null` and `undefined`, but makes the intent much
harder to read. Prefer placing the conditional around the modifier invocation instead.

## Examples

This rule **forbids** the following:

```gjs
<template>
  <div
    {{(modifier
      (unless this.hasBeenClicked 'track-interaction')
      'click'
      customizeData=this.customizeClickData
    )}}
  ></div>
</template>
```

```gjs
<template>
  <div {{(modifier)}}></div>
</template>
```

This rule **allows** the following:

```gjs
<template>
  <div
    {{(unless
      this.hasBeenClicked
      (modifier 'track-interaction' 'click' customizeData=this.customizeClickData)
    )}}
  ></div>
</template>
```

## Why?

Using complex expressions as the modifier name reduces readability and makes it harder
to understand which modifier is being applied.

## References

- [Ember.js Guides - Modifiers](https://guides.emberjs.com/release/components/template-lifecycle-dom-and-modifiers/#toc_event-handlers)
