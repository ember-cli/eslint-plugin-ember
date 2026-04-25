# ember/template-require-iframe-title

💼 This rule is enabled in the 📋 `template-lint-migration` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

## `<iframe>`

`<iframe>` elements must have a unique title property so assistive
technology can convey their content to the user. The normative
requirement is [WCAG SC 4.1.2 (Name, Role, Value)](https://www.w3.org/TR/UNDERSTANDING-WCAG20/ensure-compat-rsv.html);
the `title` attribute is _one sufficient technique_ for meeting it
(sufficient technique [H64](https://www.w3.org/WAI/WCAG21/Techniques/html/H64)).

## Examples

This rule **allows** the following:

```gjs
<template>
  <iframe title='This is a unique title' />
  <iframe title={{someValue}} />
</template>
```

This rule **forbids** the following:

```gjs
<template>
  <iframe />
  <iframe title='' />
  <iframe title='   ' />
  <iframe title={{null}} />
  <iframe title={{undefined}} />
  <iframe title={{true}} />
  <iframe title={{false}} />
  <iframe title={{42}} />
</template>
```

## References

- [WCAG SC 4.1.2 — Name, Role, Value](https://www.w3.org/TR/UNDERSTANDING-WCAG20/ensure-compat-rsv.html)
  — the normative requirement.
- [WCAG Technique H64 — Using the title attribute of the iframe element](https://www.w3.org/WAI/WCAG21/Techniques/html/H64)
  — a sufficient technique for SC 4.1.2, not itself normative.
- [WCAG Success Criterion 2.4.1 — Bypass Blocks](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-skip.html)
- [ACCNAME 1.2 — accessible-name computation](https://www.w3.org/TR/accname-1.2/)
- [axe-core rule `frame-title`](https://dequeuniversity.com/rules/axe/4.10/frame-title)
