# ember/use-ember-data-rfc-395-imports

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Use &#34;Ember Data Packages&#34; from Ember RFC #395.

The goal of this rule is to ease the migration to the new @ember-data packages.

## Context

ember-data has been split in multiple packages. For instance, its store is now released in "@ember-data/store" package. These packages have been released starting from ember-data version 3.11.

For TypeScript users, imports from `ember-data/types/registries/*` are still allowed since there is currently no equivalent in the new packages.

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
