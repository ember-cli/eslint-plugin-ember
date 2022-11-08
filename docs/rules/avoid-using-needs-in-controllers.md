# ember/avoid-using-needs-in-controllers

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Avoid using `needs` to load other controllers. Inject the required controller instead. `needs` was deprecated in ember 1.x and removed in 2.0.

## Examples

Examples of **incorrect** code for this rule:

```js
export default Controller.extend({
  needs: ['comments'],
  newComments: alias('controllers.comments.newest')
});
```

Examples of **correct** code for this rule:

```js
import Controller, { inject as controller } from '@ember/controller';

export default Component.extend({
  comments: controller(),
  newComments: alias('comments.newest')
});
```

## Help Wanted

| Issue | Link |
| :-- | :-- |
| ❌ Missing native JavaScript class support | [#560](https://github.com/ember-cli/eslint-plugin-ember/issues/560) |
