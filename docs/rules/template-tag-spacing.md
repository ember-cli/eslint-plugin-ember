# ember/template-tag-spacing

> Require a blank line between class members and `<template>` in `.gjs`/`.gts` files.

## Rule Details

When using template tags in `.gjs`/`.gts` files, this rule requires an empty line between `<template>` and adjacent JavaScript/TypeScript code.

This applies both inside class bodies and at the file top level.

When `<template>` is in the middle of class members, prefer `ember/template-tag-position` to move it first. This rule intentionally avoids autofixing middle-placement cases to prevent overlapping fixes.

```gjs
// good
export default class ExampleComponent extends Component {
  message = 'hello';

  <template>
    {{this.message}}
  </template>
}

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

// bad
export default class ExampleComponent extends Component {
  <template>
    {{this.message}}
  </template>
  message = 'hello';
}

// bad
import Service from '@ember/service';
<template>
  <div>Hello</div>
</template>
const ready = true;

// good
import Service from '@ember/service';

<template>
  <div>Hello</div>
</template>

const ready = true;
```

