# ember/template-no-with

<!-- end auto-generated rule header -->

The use of `{{with}}` has been deprecated, you should replace it with either `{{let}}` or a combination of `{{let}}`, `{{if}}` and `{{else}}`.

## Examples

This rule **forbids** the following:

```gjs
<template>
  {{#with (hash name='Ben' age=4) as |person|}}
    Hi
    {{person.name}}, you are
    {{person.age}}
    years old.
  {{/with}}
</template>
```

```gjs
<template>
  {{#with user.posts as |blogPosts|}}
    There are
    {{blogPosts.length}}
    blog posts.
  {{/with}}
</template>
```

```gjs
<template>
  {{#with user.posts as |blogPosts|}}
    There are
    {{blogPosts.length}}
    blog posts.
  {{else}}
    There are no blog posts.
  {{/with}}
</template>
```

This rule **allows** the following:

```gjs
<template>
  {{#let (hash name='Ben' age=4) as |person|}}
    Hi
    {{person.name}}, you are
    {{person.age}}
    years old.
  {{/let}}
</template>
```

```gjs
<template>
  {{#let user.posts as |blogPosts|}}
    {{#if blogPosts.length}}
      There are
      {{blogPosts.length}}
      blog posts.
    {{/if}}
  {{/let}}
</template>
```

```gjs
<template>
  {{#let user.posts as |blogPosts|}}
    {{#if blogPosts.length}}
      There are
      {{blogPosts.length}}
      blog posts.
    {{else}}
      There are no blog posts.
    {{/if}}
  {{/let}}
</template>
```

## References

- [Deprecate {{with}} RFC](https://github.com/emberjs/rfcs/blob/master/text/0445-deprecate-with.md)
- More information is available at the [Deprecation Guide](https://deprecations.emberjs.com/v3.x/#toc_ember-glimmer-with-syntax)
