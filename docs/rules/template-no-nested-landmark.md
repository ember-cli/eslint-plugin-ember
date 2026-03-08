# ember/template-no-nested-landmark

<!-- end auto-generated rule header -->

Disallows nesting landmark elements of the same type.

Landmark elements should not be nested within other landmarks of the same name. This creates confusion for screen reader users navigating by landmarks.

## Rule Details

This rule disallows nesting landmark elements or roles within other landmark elements or roles of the same type.

Landmark elements include:

- `<header>` (banner)
- `<nav>` (navigation)
- `<main>` (main)
- `<aside>` (complementary)
- `<footer>` (contentinfo)
- `<section>` (region)
- `<form>` (form)
- Elements with landmark roles

## List of elements & their corresponding roles

- header (banner)
- main (main)
- aside (complementary)
- form (form, search)
- main (main)
- nav (navigation)
- footer (contentinfo)

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <nav>
    <nav>Nested navigation</nav>
  </nav>
</template>
```

```gjs
<template>
  <main>
    <main>Nested main</main>
  </main>
</template>
```

```gjs
<template>
  <div role="navigation">
    <nav>Nested nav</nav>
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
  <main>
    <nav>Navigation inside main</nav>
  </main>
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

- [eslint-plugin-ember template-no-nested-landmark](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-nested-landmark.md)
- [WAI-ARIA Landmarks](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)
