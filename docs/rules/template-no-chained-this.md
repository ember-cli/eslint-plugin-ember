# ember/template-no-chained-this

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallow redundant `this.this` in templates.

Using `this.this.*` in templates is almost always a typo or copy/paste mistake. These patterns are misleading and result in unnecessary ambiguity about scope and component context.

## Rule Details

This rule disallows `this.this.*` patterns in templates (e.g., `{{this.this.foo}}` or `<this.this.Bar />`).

## Examples

### Incorrect ❌

```gjs
<template>
  {{this.this.value}}
</template>
```

```gjs
<template>
  {{#this.this.foo}}
    some text
  {{/this.this.foo}}
</template>
```

```gjs
<template>
  {{helper value=this.this.foo}}
</template>
```

```gjs
<template>
  <this.this.Component />
</template>
```

```gjs
<template>
  {{component this.this.dynamicComponent}}
</template>
```

### Correct ✅

```gjs
<template>
  {{this.value}}
</template>
```

```gjs
<template>
  <this.Component />
</template>
```

```gjs
<template>
  {{component this.dynamicComponent}}
</template>
```

```gjs
<template>
  {{@argName}}
</template>
```

## Migration

Remove the extra `this`:

Before:

```gjs
<template>
  {{this.this.foo}}
  <this.this.bar />
</template>
```

After:

```gjs
<template>
  {{this.foo}}
  <this.bar />
</template>
```

## References

- [Ember Guides - Glimmer Component Templates](https://guides.emberjs.com/release/upgrading/current-edition/glimmer-components/)
- [Handlebars Strict Mode](https://github.com/emberjs/rfcs/blob/master/text/0496-handlebars-strict-mode.md)
