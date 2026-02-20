# ember/template-require-input-label

<!-- end auto-generated rule header -->

✅ The `extends: 'plugin:ember/strict-gjs'` and `extends: 'plugin:ember/strict-gts'` property in a configuration file enables this rule.

Require form input elements to have an associated label for accessibility.

## Rule Details

This rule enforces that input, textarea, and select elements have a way to be labeled, either through an `id` attribute (which can be referenced by a `<label for="...">`) or through `aria-label` or `aria-labelledby` attributes.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <input type="text" />
</template>

<template>
  <textarea></textarea>
</template>

<template>
  <select>
    <option>Option 1</option>
  </select>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <label for="name">Name:</label>
  <input id="name" type="text" />
</template>

<template>
  <input aria-label="Name" type="text" />
</template>

<template>
  <input aria-labelledby="name-label" type="text" />
</template>

<template>
  <input type="hidden" />
</template>
```

## Options

| Name        | Type       | Default | Description                                                          |
| ----------- | ---------- | ------- | -------------------------------------------------------------------- |
| `labelTags` | `string[]` | `[]`    | Additional tag names to treat as label elements (besides `<label>`). |

## References

- [WCAG 2.1 - Labels or Instructions](https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html)
- [MDN - aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label)
