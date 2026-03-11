# ember/template-eol-last

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Require or disallow newline at the end of template files.

## Rule Details

This rule enforces at least one newline (or no newline) at the end of template files.

## Config

This rule accepts a single string option:

- `"always"` (default) — enforces that template files end with a newline
- `"never"` — enforces that template files do not end with a newline

## Examples

Examples of **incorrect** code with the default `"always"` config:

```hbs
<div>test</div>
```

Examples of **correct** code with the default `"always"` config:

```hbs
<div>test</div>
{{! newline at end of file }}
```

Examples of **incorrect** code with the `"never"` config:

```hbs
<div>test</div>
{{! trailing newline not allowed }}
```

Examples of **correct** code with the `"never"` config:

```hbs
<div>test</div>
```

## Related Rules

- [eol-last](https://eslint.org/docs/rules/eol-last) from eslint

## References

- [ember-template-lint eol-last](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/eol-last.md)
- [POSIX standard/line](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap03.html#tag_03_206)
- [Wikipedia/newline](https://en.wikipedia.org/wiki/Newline#Interpretation)
