# ember/template-require-context-role

<!-- end auto-generated rule header -->

Requires certain ARIA roles to be used in appropriate context.

Some ARIA roles must be contained within specific parent roles to be meaningful and accessible. For example, a `role="listitem"` must be inside an element with `role="list"`.

## Rule Details

This rule checks that context-dependent ARIA roles are used within the appropriate parent roles.

Roles requiring context:

- `listitem` → must be in `list`
- `option` → must be in `listbox`
- `tab` → must be in `tablist`
- `menuitem`, `menuitemcheckbox`, `menuitemradio` → must be in `menu` or `menubar`
- `treeitem` → must be in `tree`
- `row` → must be in `table`, `grid`, `treegrid`, or `rowgroup`
- And more...

## Roles to check

Format: role | required context role

- columnheader | row
- gridcell | row
- listitem | group or list
- menuitem | group, menu, or menubar
- menuitemcheckbox | menu or menubar
- menuitemradio | group, menu, or menubar
- option | listbox
- row | grid, rowgroup, or treegrid
- rowgroup | grid
- rowheader | row
- tab | tablist
- treeitem | group or tree

## `<* role><* role /></*>`

The required context role defines the owning container where this role is allowed. If a role has a required context, authors MUST ensure that an element with the role is contained inside (or owned by) an element with the required context role. For example, an element with `role="listitem"` is only meaningful when contained inside (or owned by) an element with `role="list"`. You may place intermediate elements with `role="presentation"` or `role="none"` to remove their semantic meaning.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div>
    <span role="listitem">Item</span>
  </div>
</template>
```

```gjs
<template>
  <div>
    <span role="tab">Tab 1</span>
  </div>
</template>
```

```gjs
<template>
  <div>
    <span role="menuitem">Item</span>
  </div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <ul role="list">
    <li role="listitem">Item</li>
  </ul>
</template>
```

```gjs
<template>
  <div role="tablist">
    <div role="tab">Tab 1</div>
  </div>
</template>
```

```gjs
<template>
  <div role="menu">
    <div role="menuitem">Item</div>
  </div>
</template>
```

## References

- [eslint-plugin-ember template-require-context-role](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-require-context-role.md)
- [WAI-ARIA - Required Context Roles](https://www.w3.org/TR/wai-aria-1.2/#scope)
