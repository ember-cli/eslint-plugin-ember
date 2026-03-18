# ember/template-no-scope-outside-table-headings

<!-- end auto-generated rule header -->

Disallow the `scope` attribute on elements other than `<th>`.

## Rule Details

The `scope` attribute is only valid on `<th>` elements within tables. Using it on other elements (including `<td>`) is invalid HTML and should be avoided.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div scope="col">Not a table cell</div>
</template>
```

```gjs
<template>
  <span scope="row">Wrong element</span>
</template>
```

```gjs
<template>
  <p scope="col">Paragraph</p>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <th scope="col">Header</th>
</template>
```

```gjs
<template>
  <th scope="row">Row header</th>
</template>
```

```gjs
<template>
  <div>Content without scope</div>
</template>
```

## References

- [eslint-plugin-ember template-no-scope-outside-table-headings](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-scope-outside-table-headings.md)
- [MDN: scope attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-scope)
