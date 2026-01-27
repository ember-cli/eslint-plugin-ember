# ember/template-no-empty-headings

<!-- end auto-generated rule header -->

Headings relay the structure of a webpage and provide a meaningful, hierarchical order of its content. If headings are empty or its text contents are inaccessible, this could confuse users or prevent them accessing sections of interest.

Disallow headings (h1, h2, etc.) with no accessible text content.

## Examples

This rule **forbids** the following:

```gjs
<template><h1></h1></template>
```

```gjs
<template><div role='heading' aria-level='1'></div></template>
```

```gjs
<template><h2><span aria-hidden='true'>Inaccessible text</span></h2></template>
```

This rule **allows** the following:

```gjs
<template><h1>Heading Content</h1></template>
```

```gjs
<template><h2><span>Text</span></h2></template>
```

```gjs
<template><div role='heading' aria-level='1'>Heading Content</div></template>
```

```gjs
<template><h3 aria-hidden='true'>Heading Content</h3></template>
```

```gjs
<template><h1 hidden>Heading Content</h1></template>
```

## Migration

If violations are found, remediation should be planned to ensure text content is present and visible and/or screen-reader accessible. Setting `aria-hidden="false"` or removing `hidden` attributes from the element(s) containing heading text may serve as a quickfix.

## References

- [WCAG SC 2.4.6 Headings and Labels](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-descriptive.html)
