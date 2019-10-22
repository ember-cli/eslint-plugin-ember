# No classic components (no-classic-components)

This rule aims to enforce Glimmer components instead of classic ones.


## Rule Details

If you want to migrate to Glimmer components this rule can help find the classic components that you need to migrate.

Examples of **incorrect** code for this rule:

```js

import Component from '@ember/component';

```

Examples of **correct** code for this rule:

```js

import Component from '@glimmer/component';

```
