# ember/template-linebreak-style

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Enforce consistent linebreaks in templates.

Having consistent linebreaks is important to make sure that the source code is rendered correctly in editors.

## Rule Details

This rule enforces consistent line endings in templates, independent of the operating system.

## Config

This rule accepts a single string option:

- `"unix"` (default) — enforces the usage of Unix line endings: `\n` for LF
- `"windows"` — enforces the usage of Windows line endings: `\r\n` for CRLF
- `"system"` — enforces the usage of the current platform's line ending

## Examples

Examples of **incorrect** code with the default `"unix"` config:

```hbs
<div>test</div>\r\n
```

Examples of **correct** code with the default `"unix"` config:

```hbs
<div>test</div>\n
```

Examples of **incorrect** code with the `"windows"` config:

```hbs
<div>test</div>\n
```

Examples of **correct** code with the `"windows"` config:

```hbs
<div>test</div>\r\n
```

## Related Rules

- [linebreak-style](https://eslint.org/docs/rules/linebreak-style) from eslint

## References

- [ember-template-lint linebreak-style](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/linebreak-style.md)
- [Git/line endings](https://docs.github.com/en/github/using-git/configuring-git-to-handle-line-endings)
