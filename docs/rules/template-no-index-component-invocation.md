# ember/template-no-index-component-invocation

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

<!-- end auto-generated rule header -->

Disallows invocation of components with `/index` suffix.

## Rule Details

Components should be invoked using the parent directory name instead of appending `/index` to the path.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <MyComponent/index />
</template>
```

```gjs
<template>
  <Foo/index />
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <MyComponent />
</template>
```

```gjs
<template>
  <Foo />
</template>
```

## References

- [ember-template-lint no-index-component-invocation](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-index-component-invocation.md)
