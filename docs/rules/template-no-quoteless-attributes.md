# ember/template-no-quoteless-attributes

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

In HTML, all attribute values are considered strings, regardless of whether they are quoted or not.

The following two examples are _identical_ from the perspective of the browser:

```gjs
<template>
  <div data-foo="asdf"></div>
  <div data-foo="asdf"></div>
</template>
```

This fact makes the following HTML very confusing:

```gjs
<template><input disabled="false" /></template>
```

In this case, the simple _presence_ of the `disabled` attribute means that the `<input>` is disabled and setting the value to `false` doesn't do the obvious thing.

This is just _one_ (of many) cases where the default "string" based parsing of attributes in HTML can trip folks up.

This rule attempts to make this situation _slightly_ better by at least ensuring that all attribute values are quoted. This obviously doesn't fix the :troll:y nature of HTML here but it does ensure that you still **see** the quotes (which should hopefully help remind you that these are strings and not values).

## Examples

This rule **forbids** the following (note that `someValue` could have been intended either as a string or expression):

```gjs
<template><div data-foo="someValue"></div></template>
```

This rule **allows** the following:

```gjs
<template><div data-foo="someValue"></div></template>
```

```gjs
<template><div data-foo={{someValue}}></div></template>
```

## References

- [HTML spec/attributes](https://html.spec.whatwg.org/multipage/dom.html#attributes)
