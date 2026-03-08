# ember/template-no-unnecessary-curly-parens

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallow unnecessary parentheses enclosing statements in curlies. When invoking a helper with arguments, the outer parentheses around the entire expression are unnecessary.

## Rule Details

This rule flags `{{(helper args)}}` where the parentheses around the helper call can be removed, becoming `{{helper args}}`.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{(concat "a" "b")}}
</template>
```

```gjs
<template>
  {{(helper a="b")}}
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  {{concat "a" "b"}}
</template>
```

```gjs
<template>
  {{(foo)}}
</template>
```

```gjs
<template>
  {{this.property}}
</template>
```

## References

- [eslint-plugin-ember template-no-unnecessary-curly-parens](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-unnecessary-curly-parens.md)
