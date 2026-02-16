# ember/template-no-args-paths

<!-- end auto-generated rule header -->

Disallow the use of `@args` in template paths. Instead of accessing arguments through `@args.foo`, use `@foo` directly.

## Rule Details

This rule prevents the use of `@args.` prefix in template paths. In Ember templates, arguments should be accessed directly using `@argName` syntax rather than through the `@args` object.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  {{@args.foo}}
</template>
```

```gts
<template>
  <div>{{@args.name}}</div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  {{@foo}}
</template>
```

```gts
<template>
  <div>{{@name}}</div>
</template>
```

## References

- [ember-template-lint no-args-paths](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-args-paths.md)
