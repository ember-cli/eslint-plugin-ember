# ember/template-self-closing-void-elements

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallow or require self-closing void elements.

HTML has no self-closing tags. The HTML5 parser will ignore a self-closing marker on
[void elements](https://html.spec.whatwg.org/#void-elements) (elements that should not
have a closing tag), but it is unnecessary and can be confusing when mixed with
SVG/XML-like syntax.

## Examples

This rule **forbids** the following:

```gjs
<template>
  <img src="http://emberjs.com/images/ember-logo.svg" alt="ember" />
  <hr />
</template>
```

This rule **allows** the following:

```gjs
<template>
  <img src="http://emberjs.com/images/ember-logo.svg" alt="ember">
  <hr>
</template>
```

There may be cases where a self-closing tag is preferred for void elements. In those
cases, pass the string `"require"` to require the self-closing form instead.

## Configuration

The following values are valid configuration:

- boolean -- `true` for enabled / `false` for disabled
- string -- `"require"` to mandate the use of self-closing tags

## References

- [HTML spec/void elements](https://html.spec.whatwg.org/#void-elements)
