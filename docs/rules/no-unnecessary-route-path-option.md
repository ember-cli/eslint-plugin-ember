# no-unnecessary-route-path-option

✅ The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

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
