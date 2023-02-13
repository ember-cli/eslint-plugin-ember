# ember/no-shadow-route-definition

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Enforce no route path definition shadowing in Router.

## Rule Details

This rule disallows defining shadowing route definitions. Shadowing will result in the router failing to resolve the path of the shadowed route, leading to undesirable and incomprehensible behavior (e.g. hooks of the shadowed route not firing even though the URL matches its path).

## Examples

Examples of **incorrect** code for this rule:

```js
this.route('main', { path: '/' }, function () {
  this.route('nested');
});
this.route('nested');
```

In this example from Router perspective both `nested` routes are on URL `/nested`.
