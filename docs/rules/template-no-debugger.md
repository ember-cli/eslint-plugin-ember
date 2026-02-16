# ember/template-no-debugger

<!-- end auto-generated rule header -->

Disallows usage of `{{debugger}}` in templates.

The `{{debugger}}` helper is useful for debugging but should not be present in production code.

## Rule Details

This rule disallows the use of `{{debugger}}` statements in templates.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{debugger}}
  <div>Content</div>
</template>
```

```gjs
<template>
  {{#if condition}}
    {{debugger}}
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
  {{this.debug}}
</template>
```

## Related Rules

- [no-debugger](https://eslint.org/docs/rules/no-debugger) from ESLint

## References

- [ember-template-lint no-debugger](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-debugger.md)
