# ember/template-no-autofocus-attribute

💼 This rule is enabled in the 📋 `template-lint-migration` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallows the use of `autofocus` attribute on elements.

The `autofocus` attribute can cause usability issues for both sighted and non-sighted users by disrupting expected behavior and screen reader announcements.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <input type="text" autofocus />
</template>
```

```gjs
<template>
  <textarea autofocus></textarea>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <input type="text" />
</template>
```

```gjs
<template>
  <textarea></textarea>
</template>
```

Explicit opt-out via a mustache boolean `false` is allowed — this is the
only form that statically guarantees no rendered `autofocus` attribute
(Glimmer VM normalizes `{{false}}` to attribute removal). The string
`autofocus="false"` is still flagged per HTML boolean-attribute semantics
(any attribute presence, including the string `"false"`, enables autofocus).

```gjs
<template>
  <input autofocus={{false}} />
  {{!-- element syntax: the mustache-boolean form --}}

  {{input autofocus=false}}
  {{!-- mustache syntax: the hash-pair form --}}
</template>
```

`<dialog>` and its descendants are exempt. A dialog is expected to focus its
initial element on open, per
[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog):

```gjs
<template>
  <dialog>
    <button autofocus>Close</button>
  </dialog>
</template>
```

## When Not To Use It

If you need to autofocus for specific accessibility or UX requirements and have thoroughly tested with assistive technologies, you may disable this rule for those specific cases.

## References

- [eslint-plugin-ember template-no-autofocus-attribute](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-autofocus-attribute.md)
- [MDN autofocus attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus)
