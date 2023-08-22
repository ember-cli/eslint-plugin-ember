# ember/template-indent

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule extends the base [eslint indent](https://eslint.org/docs/latest/rules/indent) rule, but only applies the indents to Glimmer Nodes.

Otherwise, it receives the same options as the original and can run together with the base rule.

## Configuration

<!-- begin auto-generated rule options list -->

| Name             | Type     | Default |
| :--------------- | :------- | :------ |
| `ignoreComments` | Boolean  | `false` |
| `ignoredNodes`   | String[] |         |

<!-- end auto-generated rule options list -->

## Rule Details

Enforce consistent indentation for fcct templates

```js
const rules = {
  'ember/template-indent': [
    'error',
    2, // or 'tab'
    {
      ignoreComments: false,
      ignoredNodes: []
    }
  ]
};
```

## Examples

Examples of **incorrect** code for this rule:

```gjs
// my-octane-component.gjs
<template>
  <div>
    
        </div>
</template>
}
```

Examples of **correct** code for this rule:

```gjs
// my-component.gjs
<template>
  <div>

  </div>
</template>
```

## References

- [eslint indent](https://eslint.org/docs/latest/rules/indent)
