# ember/template-no-block-params-for-html-elements

<!-- end auto-generated rule header -->

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

Disallow block params on HTML elements.

Block params (using the `as |param|` syntax) are a feature specific to Ember components and block helpers. They should not be used on regular HTML elements.

## Rule Details

This rule disallows using block params on HTML elements. Use components if you need to pass block params.

## Examples

### Incorrect ❌

```gjs
<template>
  <div as |content|>
    {{content}}
  </div>
</template>
```

```gjs
<template>
  <section as |data|>
    <p>{{data}}</p>
  </section>
</template>
```

```gjs
<template>
  <ul as |items|>
    <li>{{items}}</li>
  </ul>
</template>
```

### Correct ✅

```gjs
<template>
  <div>Content</div>
</template>
```

```gjs
<template>
  <MyComponent as |item|>
    {{item.name}}
  </MyComponent>
</template>
```

```gjs
<template>
  {{#each this.items as |item|}}
    <li>{{item}}</li>
  {{/each}}
</template>
```

## Related Rules

- [template-no-arguments-for-html-elements](./template-no-arguments-for-html-elements.md)

## References

- [Ember Guides - Block Content](https://guides.emberjs.com/release/components/block-content/)
- [eslint-plugin-ember template-no-yield-only](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-yield-only.md)
