# Use `module` instead of `moduleFor` (no-test-module-for)

`moduleForComponent`, `moduleFor`, `moduleForAcceptance`, etc have been deprecated and there are codemods to help migrate.

## Rule Details

Examples of **incorrect** code for this rule:

```js
moduleFor('Test Name');
```

Examples of **correct** code for this rule:

```js
module('Test Name', function(hooks) {

});
```

## Migration

* [ember-qunit-codemod](https://github.com/ember-codemods/ember-qunit-codemod)
