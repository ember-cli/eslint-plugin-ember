# ember/template-require-context-role

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

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

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div role="listitem">Item</div>
</template>
```

```gjs
<template>
  <div role="tab">Tab 1</div>
</template>
```

```gjs
<template>
  <div role="menuitem">Item</div>
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

- [ember-template-lint require-context-role](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/require-context-role.md)
- [WAI-ARIA - Required Context Roles](https://www.w3.org/TR/wai-aria-1.2/#scope)
