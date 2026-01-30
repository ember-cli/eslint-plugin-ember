# ember/template-no-jsx-attributes

💼 This rule is enabled in the following [configs](https://github.com/ember-cli/eslint-plugin-ember#-configurations): `strict-gjs`, `strict-gts`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallows JSX-style camelCase attributes in templates.

Folks coming from React may have developed habits around how they type attributes on elements.
JSX isn't HTML (it's JS), so in JS, you can't have kebab-case identifiers, so JSX uses camelCase.

However, since Ember uses HTML, camelCase attributes are not valid when writing components.

## Examples

This rule **forbids** the following attributes:

- acceptCharset
- accessKey
- allowFullScreen
- allowTransparency
- autoComplete
- autoFocus
- autoPlay
- cellPadding
- cellSpacing
- charSet
- className
- contentEditable
- contextMenu
- crossOrigin
- dataTime
- encType
- formAction
- formEncType
- formMethod
- formNoValidate
- formTarget
- frameBorder
- httpEquiv
- inputMode
- keyParams
- keyType
- noValidate
- marginHeight
- marginWidth
- maxLength
- mediaGroup
- minLength
- radioGroup
- readOnly
- rowSpan
- spellCheck
- srcDoc
- srcSet
- tabIndex
- useMap

This rule **forbids** the following:

```hbs
<div className='foo'></div>
<div contentEditable='true'></div>
<img srcSet='image.jpg 1x, image@2x.jpg 2x' />
```

This rule **allows** the following:

```hbs
<div class='foo'></div>
<div contenteditable='true'></div>
<img srcset='image.jpg 1x, image@2x.jpg 2x' />
```

## References

- [HTML Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes)
- [React JSX differences](https://reactjs.org/docs/dom-elements.html#differences-in-attributes)
