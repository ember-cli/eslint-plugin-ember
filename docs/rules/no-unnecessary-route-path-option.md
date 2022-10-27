# ember/no-unnecessary-route-path-option

✅ This rule is enabled in the `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallow unnecessary route `path` option.

When defining a route, it's not necessary to specify the `path` option if it matches the route name.

## Examples

Examples of **incorrect** code for this rule:

```js
this.route('blog-posts', { path: '/blog-posts' });
```

Examples of **correct** code for this rule:

```js
this.route('blog-posts');
```

```js
this.route('blog-posts', { path: '/blog' });
```

## References

- [Ember Routing Guide](https://guides.emberjs.com/release/routing/)

## Related Rules

- [no-capital-letters-in-routes](no-capital-letters-in-routes.md)
- [no-unnecessary-index-route](no-unnecessary-index-route.md)
- [route-path-style](route-path-style.md)
- [routes-segments-snake-case](routes-segments-snake-case.md)
