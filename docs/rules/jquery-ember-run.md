# ember/jquery-ember-run

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Don’t use jQuery without the Ember Run Loop.

Using plain jQuery invokes actions outside of the Ember Run Loop. In order to have a control on all operations in Ember, it's good practice to trigger actions in a run loop (using one of the [@ember/runloop](https://api.emberjs.com/ember/3.24/classes/@ember%2Frunloop) functions).

## Examples

Examples of **incorrect** code for this rule:

```js
import $ from 'jquery';

$('#something-rendered-by-jquery-plugin').on('click', () => {
  this._handlerActionFromController();
});
```

Examples of **correct** code for this rule:

```js
import $ from 'jquery';
import { bind } from '@ember/runloop';

$('#something-rendered-by-jquery-plugin').on(
  'click',
  bind(this, this._handlerActionFromController)
);
```

## Related

- [no-global-jquery](./no-global-jquery.md)
- [no-jquery](./no-jquery.md)
