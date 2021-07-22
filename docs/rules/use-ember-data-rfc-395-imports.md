# use-ember-data-rfc-395-imports

✅ The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.

🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

Use &#34;Ember Data Packages&#34; from Ember RFC #395.

The goal of this rule is to ease the migration to the new @ember-data packages.

## Context

ember-data has been split in multiple packages. For instance, its store is now released in "@ember-data/store" package. These packages have been released starting from ember-data version 3.11.

## Examples

Examples of **incorrect** code for this rule:

```js
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
```

```js
import DS from 'ember-data';

const { Model } = 'ember-data';
```

Examples of **correct** code for this rule:

```js
import Model, { attr } from '@ember-data/model';
```

## How to fix

This rule implements a fix function (or to be more precise: it leverages the `no-old-shims` fix function). If, as a user, you can get rid of all the `import DS from "ember-data";` imports, you'll be able to use this rule fixer to complete the upgrade.

Note that [a codemod is also available](https://github.com/ember-codemods/ember-data-codemod) to complete the upgrade.

## When Not To Use It

You don't want to use this rule if you're using `ember-data@<3.11`.

## Further Reading

[Ember Data Packages RFC](https://github.com/emberjs/rfcs/blob/master/text/0395-ember-data-packages.md)
