# ember/template-no-let-reference

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): ![gjs logo](/docs/svgs/gjs.svg) `recommended-gjs`, ![gts logo](/docs/svgs/gts.svg) `recommended-gts`.

<!-- end auto-generated rule header -->

Disallows referencing let/var variables in templates.

```gjs
// app/components/foo.gjs
let foo = 1;

function increment() {
  foo++;
}

export default <template>{{ foo }}</template>;
```

This does not "work" – it doesn't error, but it will essentially capture and compile in the value of the foo variable at some arbitrary point and never update again. Even if the component is torn down and a new instance is created/rendered, it will probably still hold on to the old value when the template was initially compiled.

So, generally speaking, one should avoid referencing let variables from within &lt;template&gt; and instead prefer to use const bindings.

## Rule Detail

Use `const` variables instead of `let`.

## Examples

Examples of **incorrect** code for this rule:

```gjs
let x = 1;
<template>{{ x }}</template>;
```

```gjs
let Comp = x; // SomeComponent
<template>
  <Comp />
</template>;
```

Examples of **correct** code for this rule:

```gjs
const x = 1;
<template>{{ x }}</template>;
```

```gjs
const Comp = x; // SomeComponent
<template>
  <Comp />
</template>;
```
