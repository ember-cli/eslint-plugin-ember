# route-path-style

💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

Enforces usage of kebab-case (instead of snake_case or camelCase) in route paths.

A best practice on the web is to use kebab-case (hyphens) for separating words in URLs. This style is good for readability, clarity, SEO, etc.

Example kebab-case URL: `https://guides.emberjs.com/release/getting-started/core-concepts/`

## Examples

Examples of **incorrect** code for this rule:

```js
this.route('blog_posts');
```

```js
this.route('blogPosts');
```

```js
this.route('blog-posts', { path: '/blog_posts' });
```

```js
this.route('blog-posts', { path: '/blogPosts' });
```

Examples of **correct** code for this rule:

```js
this.route('blog-posts');
```

```js
this.route('blog_posts', { path: '/blog-posts' });
```

## References

- [Ember Routing Guide](https://guides.emberjs.com/release/routing/)
- [Keep a simple URL structure](https://support.google.com/webmasters/answer/76329) article by Google

## Related Rules

- [no-capital-letters-in-routes](no-capital-letters-in-routes.md)
- [no-unnecessary-route-path-option](no-unnecessary-route-path-option.md)
- [routes-segments-snake-case](routes-segments-snake-case.md)
