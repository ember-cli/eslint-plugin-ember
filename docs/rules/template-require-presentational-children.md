# ember/template-require-presentational-children

<!-- end auto-generated rule header -->

Requires presentational elements to only contain presentational children.

When an element is marked as presentational (with `role="none"` or `role="presentation"`), its semantic children should not be present as they would be confusing to assistive technology users.

## Rule Details

This rule checks that elements with `role="presentation"` or `role="none"` don't contain semantic children that expect the parent's semantic structure.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <ul role="presentation">
    <li>Item</li>
  </ul>
</template>
```

```gjs
<template>
  <table role="none">
    <tr><td>Data</td></tr>
  </table>
</template>
```

```gjs
<template>
  <ol role="presentation">
    <li>Item</li>
  </ol>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <ul role="presentation">
    <div>Content</div>
  </ul>
</template>
```

```gjs
<template>
  <ul>
    <li>Item</li>
  </ul>
</template>
```

```gjs
<template>
  <table>
    <tbody>
      <tr><td>Data</td></tr>
    </tbody>
  </table>
</template>
```

## References

- [eslint-plugin-ember template-require-presentational-children](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-require-presentational-children.md)
- [WAI-ARIA - Presentational Roles](https://www.w3.org/TR/wai-aria-1.2/#presentation)
