## Disallow unnecessary route `path` option

### Rule name: `no-unnecessary-route-path-option`

When defining a route, it's not necessary to specify the `path` option if it matches the route name.

### Rule Details

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

### References

* [Ember Routing Guide](https://guides.emberjs.com/release/routing/)

### Related Rules

* [no-capital-letters-in-routes](no-capital-letters-in-routes.md)
* [routes-segments-snake-case](routes-segments-snake-case.md)
