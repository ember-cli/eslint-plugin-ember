# ember/template-no-arguments-for-html-elements

<!-- end auto-generated rule header -->

Disallow `@arguments` on HTML elements.

Arguments (using the `@` prefix) are a feature specific to Ember components. They should not be used on regular HTML elements, which only support standard HTML attributes.

## Rule Details

This rule disallows using `@arguments` on HTML elements. Use regular attributes instead.

## Examples

### Incorrect ❌

```gjs
<template>
  <div @title="Hello">Content</div>
</template>
```

```gjs
<template>
  <button @onClick={{this.handler}}>Click</button>
</template>
```

```gjs
<template>
  <span @data={{this.info}}>Text</span>
</template>
```

### Correct ✅

```gjs
<template>
  <div title="Hello">Content</div>
</template>
```

```gjs
<template>
  <button {{on "click" this.handler}}>Click</button>
</template>
```

```gjs
<template>
  <MyComponent @title="Hello" @onClick={{this.handler}} />
</template>
```

Yielded components, named blocks, and path expressions are also allowed:

```hbs
{{#let (component 'bar') as |foo|}}
  <foo @name='1' />
{{/let}}
```

```hbs
<foo.some.name @name='1' />
<@foo @name='2' />
<@foo.bar @name='2' />
```

```hbs
<MyComponent>
  <:slot @name='Header'></:slot>
</MyComponent>
```

## Related Rules

- [template-no-block-params-for-html-elements](./template-no-block-params-for-html-elements.md)

## References

- [Ember Guides - Component Arguments](https://guides.emberjs.com/release/components/component-arguments-and-html-attributes/)
- [eslint-plugin-ember template-no-args-paths](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-args-paths.md)
