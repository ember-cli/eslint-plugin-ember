# ember/no-old-shims

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Don't use import paths from `ember-cli-shims`.

The import paths in `ember-cli-shims` were never considered public API and
were recently replaced by [RFC #176](https://github.com/emberjs/rfcs/pull/176).
If you use `ember-cli-babel` with version `6.6.0` or above you can start using
the "New Module Imports" instead of the old shims or the `Ember` global directly.
This will enable us to build better tree shaking feature into Ember CLI.

## Examples

Examples of **incorrect** code for this rule:

```js
import Component from 'ember-component';
import EmberObject from 'ember-object';
import computed from 'ember-computed';
import Service from 'ember-service';
import inject from 'ember-service/inject';
```

Examples of **correct** code for this rule:

```js
import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import Service, { inject } from '@ember/service';
```
