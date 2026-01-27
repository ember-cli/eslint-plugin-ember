# ember/template-no-whitespace-within-word

<!-- end auto-generated rule header -->

Disallow excess whitespace within words (e.g. "W e l c o m e").

## Rule Details

This rule detects text content where letters are separated by whitespace or whitespace HTML entities, producing a "spaced out" word effect like `W e l c o m e`. This pattern is an accessibility concern because screen readers will read each letter individually instead of reading the word.

The rule checks `GlimmerTextNode` content (excluding text inside attributes and `<style>` elements) for patterns matching alternating whitespace and letter characters.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <span>W e l c o m e</span>
</template>
```

```gjs
<template>
  <h1>H&nbsp;E&nbsp;L&nbsp;L&nbsp;O</h1>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <span>Welcome</span>
</template>
```

```gjs
<template>
  <h1>Hello World</h1>
</template>
```

## References

- [WCAG - Meaningful Sequence](https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html)
