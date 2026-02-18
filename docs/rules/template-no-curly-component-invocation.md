# ember/template-no-curly-component-invocation

<!-- end auto-generated rule header -->

Disallows curly component invocation syntax. Use angle bracket syntax instead.

There are two ways to invoke a component in a template: curly component syntax
(`{{my-component}}`), and angle bracket syntax (`<MyComponent />`). The
difference between them is syntactical. You should favour angle bracket syntax
as it improves readability of templates, i.e. disambiguates components from
helpers, and is also the future direction Ember is going with the Octane
Edition.

This rule checks all the curly braces in your app and warns about those that
look like they could be component invocations.

## Examples

This rule **forbids** the following:

```hbs
{{foo-bar}}
```

```hbs
{{nested/component}}
```

```hbs
{{#foo-bar}}content{{/foo-bar}}
```

This rule **allows** the following:

```hbs
{{foo bar}}
```

```hbs
<FooBar />
```

```hbs
<Nested::Component />
```

## Configuration

This rule accepts an options object with the following properties:

- `allow` (default: `[]`) - Array of component names to allow in curly syntax
- `disallow` (default: `[]`) - Array of component names to disallow in curly syntax
- `requireDash` (default: `false`) - Require dashes in component names
- `noImplicitThis` (default: `true`) - Don't allow implicit `this` references

```js
// .eslintrc.js
module.exports = {
  rules: {
    'ember/template-no-curly-component-invocation': [
      'error',
      {
        allow: ['some-helper'],
        disallow: [],
      },
    ],
  },
};
```

## References

- [Ember Guides - Angle Bracket Syntax](https://guides.emberjs.com/release/components/template-syntax/#toc_angle-bracket-syntax)
