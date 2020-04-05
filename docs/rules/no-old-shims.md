# no-old-shims

:white_check_mark: The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

:wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

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

```javascript
import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import Service, { inject } from '@ember/service';
```
