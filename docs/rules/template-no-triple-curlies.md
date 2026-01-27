# ember/template-no-triple-curlies

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Disallows usage of triple curly brackets (unescaped output) in templates.

Triple curly brackets (`{{{ }}}`) render unescaped HTML, which can lead to XSS (Cross-Site Scripting) vulnerabilities if user input is not properly sanitized.

## Rule Details

This rule disallows the use of triple curly brackets for unescaped output. If you need to render HTML, use the `htmlSafe` helper or `SafeString` API with proper sanitization.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{{this.content}}}
</template>
```

```gjs
<template>
  <div>
    {{{@htmlContent}}}
  </div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  {{this.content}}
</template>
```

```gjs
<template>
  {{htmlSafe this.sanitizedContent}}
</template>
```

```gjs
<template>
  <div>{{@text}}</div>
</template>
```

## When Not To Use It

If you are certain that the content being rendered is already sanitized and safe, you may disable this rule. However, this is generally discouraged for security reasons.

## Related Rules

- [no-html-safe](./no-html-safe.md) from eslint-plugin-ember

## References

- [ember-template-lint no-triple-curlies](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-triple-curlies.md)
- [Ember.js Security Guide](https://guides.emberjs.com/release/security/)
