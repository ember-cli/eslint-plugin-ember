# ember/template-no-template-lint-directives

💼 This rule is enabled in the 📋 `template-lint-migration` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallow `{{! template-lint-disable }}` / `{{! template-lint-enable }}` directives in templates, and autofix them to their `{{! eslint-disable }}` / `{{! eslint-enable }}` equivalents.

## Rule Details

The fixer:

- replaces `template-lint-disable` / `template-lint-enable` with `eslint-disable` / `eslint-enable`;
- prefixes each rule name with `ember/template-` (the namespace the rules are published under in this plugin);
- joins multiple rule names with `,` (ESLint's directive syntax) instead of whitespace (template-lint's syntax);
- converts an element-scoped directive into an `eslint-disable` / `eslint-enable` pair bracketing that element (see below).

### Preserving scope

`template-lint-disable` means different things depending on where it sits, and a
conversion that ignores that either hides violations or floods a migration with
noise. ESLint has no element scope, but an `eslint-disable` / `eslint-enable`
pair delimits an arbitrary region, which reproduces every template-lint scope
exactly:

| `template-lint-disable` placement  | scope                                           | conversion                                                              |
| ---------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------- |
| standing alone                     | comment → end of template                       | `eslint-disable` (rest of file)                                         |
| paired with `template-lint-enable` | between the two                                 | `eslint-disable` … `eslint-enable`                                      |
| inside an element's opening tag    | that element's opening tag, not its descendants | `eslint-disable` before the element, `eslint-enable` as its first child |
| with the `-tree` suffix            | that element and its descendants                | `eslint-disable` before the element, `eslint-enable` after it           |

The closing comment is inserted without a surrounding newline. `{{! }}` comments
compile away and leave no trace in the DOM, but a newline would add a whitespace
text node, which can change inline layout.

To suppress a rule across a whole file, use a file-level ESLint directive — in
`.gjs`/`.gts` a `/* eslint-disable ember/template-… */` in the JS region also
covers the `<template>` contents.

## Examples

Examples of **incorrect** code for this rule:

```hbs
{{! template-lint-disable no-implicit-this }}
{{foo}}
```

```hbs
{{! template-lint-disable no-implicit-this no-curly-component-invocation }}
{{foo bar=baz}}
```

```hbs
<div
  class='example'
  {{! template-lint-disable no-invalid-interactive }}
  {{on 'click' this.click}}
><span>hi</span></div>
```

```hbs
<div
  class='example'
  {{! template-lint-disable-tree no-invalid-interactive }}
  {{on 'click' this.click}}
><span>hi</span></div>
```

Examples of **correct** code for this rule (i.e. what the autofix produces):

```hbs
{{! eslint-disable ember/template-no-implicit-this }}
{{foo}}
```

```hbs
{{! eslint-disable ember/template-no-implicit-this, ember/template-no-curly-component-invocation }}
{{foo bar=baz}}
```

The element-scoped form closes its region as the element's first child, leaving
descendants linted:

```hbs
{{! eslint-disable ember/template-no-invalid-interactive }}
<div
  class='example'
  {{on 'click' this.click}}
>{{! eslint-enable ember/template-no-invalid-interactive }}<span>hi</span></div>
```

`-tree` closes it after the element, covering the subtree:

```hbs
{{! eslint-disable ember/template-no-invalid-interactive }}
<div class='example' {{on 'click' this.click}}><span>hi</span></div>
{{! eslint-enable ember/template-no-invalid-interactive }}
```

## When Not To Use It

If your project still uses [`ember-template-lint`](https://github.com/ember-template-lint/ember-template-lint) alongside this plugin, leave the rule off — the `template-lint-*` directives are still meaningful for that tool, and this rule will rewrite them in a way that template-lint no longer recognises.

## References

- [`ember-template-lint` configuration via comments](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/configuration.md#configuration-comments)
- [ESLint configuration via comments](https://eslint.org/docs/latest/use/configure/rules#using-configuration-comments)
