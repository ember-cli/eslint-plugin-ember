# ember/template-no-redundant-landmark-role

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallows redundant landmark roles that are implicit on HTML elements.

HTML5 semantic elements like `<nav>`, `<main>`, and `<aside>` have implicit ARIA roles. Adding these roles explicitly is redundant and adds unnecessary verbosity to the code.

## Rule Details

This rule disallows adding explicit `role` attributes when the element already has that role implicitly.

Implicit landmark roles:
- `<header>` → `role="banner"` (when not nested in `<article>` or `<section>`)
- `<footer>` → `role="contentinfo"` (when not nested in `<article>` or `<section>`)
- `<nav>` → `role="navigation"`
- `<main>` → `role="main"`
- `<aside>` → `role="complementary"`
- `<section>` → `role="region"`
- `<form>` → `role="form"`

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <nav role="navigation">Menu</nav>
</template>
```

```gjs
<template>
  <main role="main">Content</main>
</template>
```

```gjs
<template>
  <aside role="complementary">Sidebar</aside>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <nav>Menu</nav>
</template>
```

```gjs
<template>
  <main>Content</main>
</template>
```

```gjs
<template>
  <div role="navigation">Custom navigation</div>
</template>
```

## References

- [ember-template-lint no-redundant-landmark-role](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-redundant-landmark-role.md)
- [WAI-ARIA - Implicit ARIA Semantics](https://www.w3.org/TR/html-aria/)
