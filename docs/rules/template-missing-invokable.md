# ember/template-missing-invokable

Auto-fixes missing imports for helpers, modifiers, and components in your \<template> tags.

If you refer to `on` without importing it:

```gjs
<template>
  <button {{on "click" doSomething}}>Do Something</button>
</template>
```

The auto-fix will create the import:

```gjs
import { on } from '@ember/modifier';
<template>
  <button {{on "click" doSomething}}>Do Something</button>
</template>
```
