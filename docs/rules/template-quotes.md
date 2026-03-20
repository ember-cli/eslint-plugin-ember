# ember/template-quotes

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Enforce the consistent use of either double or single quotes.

## Examples

Enforce either:

```gjs
<template>
  <div class='my-class'>test</div>
  {{my-helper 'hello there'}}
</template>
```

or:

```gjs
<template>
  <div class="my-class">test</div>
  {{my-helper "hello there"}}
</template>
```

## Configuration

The following values are valid configuration:

- string -- `"double"` requires the use of double quotes wherever possible, `"single"` requires the use of single quotes wherever possible
- object -- `{ curlies: "single"|"double"|false, html: "single"|"double"|false }` - requires different quotes for Handlebars and HTML syntax

For the object config, the properties `curlies` and `html` can be passed one of the following values: `"single"`, `"double"`, or `false`. If `false` is passed to a property, it will be as if this rule is turned off for that specific syntax.

With the config `{ curlies: false, html: "double" }`, this would be **forbidden**:

```gjs
<template>
  <div foo='bar'></div>
</template>
```

However, this would be **allowed**:

```gjs
<template>
  {{component "foo"}}
  {{test x='y'}}
  <div foo="bar"></div>
</template>
```

## Related Rules

- [quotes](https://eslint.org/docs/rules/quotes) from eslint

## References

- [Google style guide/quotes](https://google.github.io/styleguide/htmlcssguide.html#HTML_Quotation_Marks)
