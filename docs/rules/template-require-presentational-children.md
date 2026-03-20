# ember/template-require-presentational-children

<!-- end auto-generated rule header -->

There are roles that require all children to be presentational. This rule checks
if descendants of an element with one of those roles are presentational. By
default, browsers are required to add `role="presentation"` to all descendants,
but we should not rely on browsers to do this.

The roles that require all children to be presentational are:

- `button`
- `checkbox`
- `img`
- `meter`
- `menuitemcheckbox`
- `menuitemradio`
- `option`
- `progressbar`
- `radio`
- `scrollbar`
- `separator`
- `slider`
- `switch`
- `tab`

Please note that children of `<svg>` tags will not be checked by this rule, as
they have somewhat special semantics.

## Examples

This rule **forbids** the following:

```gjs
<template>
  <li role="tab"><h3>Title of My Tab</h3></li>
</template>
```

```gjs
<template>
  <div role="button">
    <h2 role="presentation">
      <button>Test <img /></button>
    </h2>
  </div>
</template>
```

This rule **allows** the following:

```gjs
<template>
  <li role="tab">Title of My Tab</li>
</template>
```

```gjs
<template>
  <li role="tab"><h3 role="presentation">Title of My Tab</h3></li>
</template>
```

## Migration

If violations are found, remediation should be planned to either add
`role="presentation"` to the descendants as a quickfix. A better fix is to not
use semantic descendants.

## Configuration

- object -- An object with the following keys:
  - `additionalNonSemanticTags` -- An array of additional tags that should be considered presentation

```json
{
  "ember/template-require-presentational-children": [
    "error",
    {
      "additionalNonSemanticTags": ["my-custom-element"]
    }
  ]
}
```

## References

- [Roles That Automatically Hide Semantics by Making Their Descendants Presentational](https://w3c.github.io/aria-practices/#children_presentational)
