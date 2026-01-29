# ember/template-no-duplicate-landmark-elements

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Disallows duplicate landmark elements without unique labels.

HTML5 landmark elements (like `<nav>`, `<header>`, `<footer>`, etc.) help screen reader users navigate a page. When multiple landmarks of the same type exist, each must have a unique label to distinguish them.

## Rule Details

This rule ensures that when multiple landmark elements of the same type appear in a template, each has a unique `aria-label` or `aria-labelledby` attribute.

Landmark elements checked:

- `header`
- `footer`
- `main`
- `nav`
- `aside`
- `section`

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <nav>Primary Navigation</nav>
  <nav>Secondary Navigation</nav>
</template>
```

```gjs
<template>
  <header>Site Header</header>
  <header>Article Header</header>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <nav aria-label="Primary Navigation">Links</nav>
  <nav aria-label="Secondary Navigation">More Links</nav>
</template>
```

```gjs
<template>
  <header aria-label="Site Header">Site Logo</header>
  <header aria-label="Article Header">Article Title</header>
</template>
```

```gjs
<template>
  <nav aria-labelledby="nav-1">
    <h2 id="nav-1">Main Menu</h2>
  </nav>
  <nav aria-labelledby="nav-2">
    <h2 id="nav-2">Side Menu</h2>
  </nav>
</template>
```

## References

- [ARIA Landmarks](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)
- [ember-template-lint no-duplicate-landmark-elements](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-duplicate-landmark-elements.md)
