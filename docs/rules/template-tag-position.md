# ember/template-tag-position

> Enforce where `<template>` appears in classes in `.gjs`/`.gts` files.

## Rule Details

When using template tags in class bodies, keeping `<template>` in a consistent place makes components easier to scan.

This rule enforces that `<template>` appears either:

- `'after'` class members (default)
- `'before'` class members

## Options

### `'after'` (default)

```gjs
// good
export default class ExampleComponent extends Component {
  message = 'hello';

  <template>
    {{this.message}}
  </template>
}

// bad
export default class ExampleComponent extends Component {
  <template>
    {{this.message}}
  </template>
  message = 'hello';
}
```

### `'before'`

```gjs
// good
export default class ExampleComponent extends Component {
  <template>
    {{this.message}}
  </template>

  message = 'hello';
}

// bad
export default class ExampleComponent extends Component {
  message = 'hello';
  <template>
    {{this.message}}
  </template>
}
```

