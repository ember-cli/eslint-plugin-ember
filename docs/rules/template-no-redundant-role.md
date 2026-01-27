# ember/template-no-redundant-role

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): ✅ `recommended`, `strict-gjs`, `strict-gts`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallows redundant role attributes on semantic HTML elements.

The rule checks for redundancy between any semantic HTML element with a default/implicit ARIA role and the role provided.

For example, if a landmark element is used, any role provided will either be redundant or incorrect. This rule ensures that no role attribute is placed on any of the landmark elements, with the following exceptions:

- a `nav` element with the `navigation` role to [make the structure of the page more accessible to user agents](https://www.w3.org/WAI/GL/wiki/Using_HTML5_nav_element#Example:The_.3Cnav.3E_element)
- a `form` element with the `search` role to [identify the form's search functionality](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/search_role#examples)
- a `input` element with `combobox` role to [identify the input as a combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-both/)

## Examples

This rule **forbids** the following:

```hbs
<header role='banner'></header>
```

```hbs
<main role='main'></main>
```

```hbs
<aside role='complementary'></aside>
```

```hbs
<footer role='contentinfo'></footer>
```

```hbs
<form role='form'></form>
```

This rule **allows** the following:

```hbs
<form role='search'></form>
```

```hbs
<nav role='navigation'></nav>
```

```hbs
<input role='combobox' />
```

## Configuration

This rule accepts an options object with the following properties:

- `checkAllHTMLElements` (default: `true`) - When set to `true`, checks all HTML elements for redundant roles. When `false`, only checks landmark elements.

```js
// .eslintrc.js
module.exports = {
  rules: {
    'ember/template-no-redundant-role': ['error', { checkAllHTMLElements: false }],
  },
};
```

## References

- [ARIA Roles](https://www.w3.org/TR/wai-aria-1.2/#role_definitions)
- [HTML ARIA](https://www.w3.org/TR/html-aria/)
