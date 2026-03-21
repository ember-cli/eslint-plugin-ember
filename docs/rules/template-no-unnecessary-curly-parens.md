# ember/template-no-unnecessary-curly-parens

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallow unnecessary parentheses enclosing statements in curlies. When invoking a helper with arguments, the outer parentheses around the entire expression are unnecessary.

## Examples

This rule **forbids** the following:

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

This rule **allows** the following:

```gjs
<template>
  {{foo}}
  {{(foo)}}
  {{concat "a" "b"}}
  {{concat (capitalize "foo") "-bar"}}
</template>
```

## References

- Ember's [Helper Functions](https://guides.emberjs.com/release/components/helper-functions/) guide
