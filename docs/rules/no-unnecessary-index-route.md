## Disallow unnecessary `index` route definition

### Rule name: `no-unnecessary-index-route`

The `index` route (for the `/` path) is automatically provided at every level of nesting and does not need to be defined in the router.

### Rule Details

Examples of **incorrect** code for this rule:

```js
this.route('index');
```

```js
this.route('index', { path: '/' });
```

Examples of **correct** code for this rule:

```js
this.route('blog-posts');
```

### References

* [Ember Routing Guide](https://guides.emberjs.com/release/routing/)

### Related Rules

* [no-capital-letters-in-routes](no-capital-letters-in-routes.md)
* [no-unnecessary-route-path-option](no-unnecessary-route-path-option.md)
* [routes-segments-snake-case](routes-segments-snake-case.md)
