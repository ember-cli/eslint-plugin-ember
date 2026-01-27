# ember/template-no-forbidden-elements

<!-- end auto-generated rule header -->

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

This rule disallows the use of forbidden elements in template files.

The rule is configurable so teams can add their own disallowed elements.
The default list of forbidden elements are `meta`, `style`, `html` and `script`.

## Examples

This rule **forbids** the following:

```hbs
<script></script>
```

```hbs
<style></style>
```

```hbs
<html></html>
```

```hbs
<meta charset='utf-8' />
```

This rule **allows** the following:

```hbs
<header></header>
```

```hbs
<div></div>
```

```hbs
<head>
  <meta charset='utf-8' />
</head>
```

## Configuration

- `boolean` — `true` to enable with defaults / `false` to disable
- `string[]` — an array of element names to forbid (default: `['meta', 'html', 'script']`)

## References

- [Ember guides/template restrictions](https://guides.emberjs.com/release/components/#toc_restrictions)
