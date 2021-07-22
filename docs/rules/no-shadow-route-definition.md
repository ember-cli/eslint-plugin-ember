# no-shadow-route-definition

✅ The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

Enforce no route path definition shadowing in Router.

## Rule Details

This rule disallows defining shadowing route definitions.

## Examples

Examples of **incorrect** code for this rule:

```js
this.route('main', { path: '/' }, function () {
  this.route('nested');
});
this.route('nested');
```

In this example from Router perspective both `nested` routes are on URL `/nested`.
