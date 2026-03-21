# ember/template-no-unbalanced-curlies

<!-- end auto-generated rule header -->

Normally, the compiler will find stray curlies and throw a syntax error. However, it won't be able to catch every case.

For example, these are all syntax errors:

```gjs
<template>
  {{ x }
  {{ x }}}
  {{{ x }
  {{{ x }}
</template>
```

Whereas these are not:

```gjs
<template>
  { x }}
  { x }
  }
  }}
  }}}
  }}}}... (any number of closing curlies past one)
</template>
```

This rule focuses on closing double `}}` and triple `}}}` curlies with no matching opening curlies.

## Examples

This rule **forbids** the following:

```gjs
<template>
  foo}}
  {foo}}
  foo}}}
  {foo}}}
</template>
```

## Migration

If you have curlies in your code that you wish to show verbatim, but are flagged by this rule, you can formulate them as a handlebars expression:

```gjs
<template>
  <p>This is a closing double curly: {{ '}}' }}</p>
  <p>This is a closing triple curly: {{ '}}}' }}</p>
</template>
```

## References

- [Handlebars docs/expressions](https://handlebarsjs.com/guide/expressions.html)
