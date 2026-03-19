# ember/template-table-groups

<!-- end auto-generated rule header -->

Requires table elements to use table grouping elements.

Tables should use `<thead>`, `<tbody>`, and `<tfoot>` elements to group related content. This improves accessibility for screen reader users and makes the table structure more semantic.

## Rule Details

This rule requires that `<table>` elements use grouping elements (`<thead>`, `<tbody>`, `<tfoot>`) instead of having `<tr>` elements as direct children.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <table>
    <tr><td>Data</td></tr>
  </table>
</template>
```

```gjs
<template>
  <table>
    <tr><th>Header</th></tr>
    <tr><td>Data</td></tr>
  </table>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <table>
    <thead>
      <tr><th>Header</th></tr>
    </thead>
    <tbody>
      <tr><td>Data</td></tr>
    </tbody>
  </table>
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

## Options

| Name                          | Type       | Default | Description                                    |
| ----------------------------- | ---------- | ------- | ---------------------------------------------- |
| `allowed-table-components`    | `string[]` | `[]`    | Component names treated as `<table>` elements. |
| `allowed-caption-components`  | `string[]` | `[]`    | Component names treated as `<caption>`.        |
| `allowed-colgroup-components` | `string[]` | `[]`    | Component names treated as `<colgroup>`.       |
| `allowed-thead-components`    | `string[]` | `[]`    | Component names treated as `<thead>`.          |
| `allowed-tbody-components`    | `string[]` | `[]`    | Component names treated as `<tbody>`.          |
| `allowed-tfoot-components`    | `string[]` | `[]`    | Component names treated as `<tfoot>`.          |

## References

- [eslint-plugin-ember template-table-groups](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-table-groups.md)
- [MDN - Table structure](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Advanced)
