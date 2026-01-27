# ember/template-no-capital-arguments

<!-- end auto-generated rule header -->

Disallow capital letters in argument names. Use lowercase argument names (e.g., `@arg` instead of `@Arg`).

## Rule Details

This rule enforces the convention that argument names should start with lowercase letters. Anything that does not start with a lowercase letter (such as `@Foo`, `@0`, `@!` etc) is a reserved argument name. This is purely speculative and the goal is to carve out some space for future features. If we don't end up needing them, we can always relax the restrictions down the road.

Additionally, the following are reserved names and will also be flagged by this rule:

- `@arguments`
- `@args`
- `@block`
- `@else`

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div>{{@Arg}}</div>
</template>
```

```gjs
<template>
  <div>{{@MyArgument}}</div>
</template>
```

```gjs
<template>
  <div>{{@arguments}}</div>
</template>
```

```gjs
<template>
  <Foo @args={{true}} />
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <div>{{@arg}}</div>
</template>
```

```gjs
<template>
  <div>{{@myArgument}}</div>
</template>
```

## References

- [RFC #276 - Reserved Names](https://github.com/emberjs/rfcs/blob/68812bf2d439c6bb77ad491e0159b371b68c5c35/text/0276-named-args.md#reserved-names)
- [Ember Style Guide](https://github.com/ember-cli/ember-styleguide)
