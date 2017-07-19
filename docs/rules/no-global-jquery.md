# No global jQuery (no-global-jquery)
Do not use global `$` or `jQuery`.

## Rule Details

In general, we want application code to reference the version of jQuery that's been directly pinned to the version of Ember used. This helps avoid version conflicts, and ensures that code inside modules isn't reliant on global variables.

Examples of **incorrect** code for this rule:

```js
export default Component.extend({
  init() {
    $('.foo').addClass('bar'); //global usage
  }
});
```

Examples of **correct** code for this rule:

```js
import Ember from 'ember';

const { $ } = Ember;
export default Component.extend({
  init() {
    Ember.$('.foo').addClass('bar') //usage from Ember object
    // or even better
    $('.foo').addClass('bar'); // deconstruction from Ember object
  }
});

```
