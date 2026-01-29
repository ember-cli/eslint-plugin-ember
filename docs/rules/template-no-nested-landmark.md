# ember/template-no-nested-landmark

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Disallows nested landmark elements.

Landmark elements should not be nested within other landmarks. This creates confusion for screen reader users navigating by landmarks.

## Rule Details

This rule disallows nesting landmark elements or roles within other landmark elements or roles.

Landmark elements include:

- `<header>` (banner)
- `<nav>` (navigation)
- `<main>` (main)
- `<aside>` (complementary)
- `<footer>` (contentinfo)
- `<section>` (region)
- `<form>` (form)
- Elements with landmark roles

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <nav>
    <main>Content</main>
  </nav>
</template>
```

```gjs
<template>
  <main>
    <nav>Navigation</nav>
  </main>
</template>
```

```gjs
<template>
  <div role="main">
    <div role="navigation">Nav</div>
  </div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <nav>Navigation</nav>
  <main>Content</main>
</template>
```

```gjs
<template>
  <div>
    <nav>Nav 1</nav>
    <nav>Nav 2</nav>
  </div>
</template>
```

```gjs
<template>
  <main>
    <div>Regular content</div>
  </main>
</template>
```

## References

- [ember-template-lint no-nested-landmark](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-nested-landmark.md)
- [WAI-ARIA Landmarks](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)
