# ember/template-no-log

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): ![gjs logo](/docs/svgs/gjs.svg) `recommended-gjs`, ![gts logo](/docs/svgs/gts.svg) `recommended-gts`.

<!-- end auto-generated rule header -->

Disallows usage of `{{log}}` in templates.

The `{{log}}` helper is useful for debugging but should not be present in production code. Use proper logging libraries or console statements in JavaScript code instead.

## Rule Details

This rule disallows the use of `{{log}}` statements in templates.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{log "debug message"}}
  <div>Content</div>
</template>
```

```gjs
<template>
  {{#if condition}}
    {{log this.value}}
  {{/if}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div>Content</div>
</template>
```

```gjs
<template>
  {{this.log}}
</template>
```

```gjs
<template>
  {{logger "info"}}
</template>
```

## Related Rules

- [no-console](https://eslint.org/docs/rules/no-console) from ESLint

## References

- [ember-template-lint no-log](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-log.md)
