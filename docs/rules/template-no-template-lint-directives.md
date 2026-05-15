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
- when the directive appears inside an element's opening tag (between attributes), lifts it to its own line just before the element. ESLint scopes line-based directives from the line they appear on, and the violation typically lives on the element's start line, so leaving the directive inside the attribute list would put it after the violation it's meant to cover.

The `-tree` suffix on a directive (e.g. `template-lint-disable-tree`) does **not** match this rule. ESLint has no equivalent of template-lint's subtree-scoped directives, so they need manual handling rather than a mechanical conversion.

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
></div>
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

```hbs
{{! eslint-disable ember/template-no-invalid-interactive }}
<div class='example' {{on 'click' this.click}}></div>
```

## When Not To Use It

If your project still uses [`ember-template-lint`](https://github.com/ember-template-lint/ember-template-lint) alongside this plugin, leave the rule off — the `template-lint-*` directives are still meaningful for that tool, and this rule will rewrite them in a way that template-lint no longer recognises.

## References

- [`ember-template-lint` configuration via comments](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/configuration.md#configuration-comments)
- [ESLint configuration via comments](https://eslint.org/docs/latest/use/configure/rules#using-configuration-comments)
