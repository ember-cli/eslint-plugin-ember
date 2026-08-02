//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-template-lint-directives');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-template-lint-directives', rule, {
  valid: [
    // Unrelated Glimmer comment
    '<template>{{! just a comment }}<div></div></template>',
    // JS-side block comment with similar text — not in a template
    '/* template-lint-disable no-log */ const x = 1;',
  ],
  invalid: [
    {
      code: '<template>{{! template-lint-disable no-log }}{{log "x"}}</template>',
      output: '<template>{{! eslint-disable ember/template-no-log }}{{log "x"}}</template>',
      errors: [{ messageId: 'convert' }],
    },
    {
      code: '<template>{{!-- template-lint-disable no-log --}}{{log "x"}}</template>',
      output: '<template>{{!-- eslint-disable ember/template-no-log --}}{{log "x"}}</template>',
      errors: [{ messageId: 'convert' }],
    },
    {
      code: '<template>{{! template-lint-disable no-log no-debugger }}{{log "x"}}{{debugger}}</template>',
      output:
        '<template>{{! eslint-disable ember/template-no-log, ember/template-no-debugger }}{{log "x"}}{{debugger}}</template>',
      errors: [{ messageId: 'convert' }],
    },
    {
      code: '<template>{{! template-lint-disable no-log}}{{log "x"}}</template>',
      output: '<template>{{! eslint-disable ember/template-no-log }}{{log "x"}}</template>',
      errors: [{ messageId: 'convert' }],
    },
    {
      code: '<template>{{! template-lint-enable no-log }}{{log "x"}}</template>',
      output: '<template>{{! eslint-enable ember/template-no-log }}{{log "x"}}</template>',
      errors: [{ messageId: 'convert' }],
    },
    // ember-template-lint unquotes each rule name (single or double quotes),
    // so quoted names are live directives in migrating codebases and must
    // convert to bare eslint rule names.
    {
      code: '<template>{{! template-lint-disable "no-log" }}{{log "x"}}</template>',
      output: '<template>{{! eslint-disable ember/template-no-log }}{{log "x"}}</template>',
      errors: [{ messageId: 'convert' }],
    },
    {
      code: '<template>{{! template-lint-disable \'no-log\' }}{{log "x"}}</template>',
      output: '<template>{{! eslint-disable ember/template-no-log }}{{log "x"}}</template>',
      errors: [{ messageId: 'convert' }],
    },
    {
      code: '<template>{{! template-lint-disable "no-log" no-debugger }}{{log "x"}}</template>',
      output:
        '<template>{{! eslint-disable ember/template-no-log, ember/template-no-debugger }}{{log "x"}}</template>',
      errors: [{ messageId: 'convert' }],
    },
    {
      code: '<template>{{! template-lint-enable "no-log" }}{{log "x"}}</template>',
      output: '<template>{{! eslint-enable ember/template-no-log }}{{log "x"}}</template>',
      errors: [{ messageId: 'convert' }],
    },
    // Mismatched or lone quotes are not a quoted name — upstream's unquote
    // only strips when the first and last character are the same quote.
    {
      code: '<template>{{! template-lint-disable "no-log\' }}{{log "x"}}</template>',
      output: '<template>{{! eslint-disable ember/template-"no-log\' }}{{log "x"}}</template>',
      errors: [{ messageId: 'convert' }],
    },
    // Directive inside an element's opening tag is lifted to before the
    // element so the eslint-disable scope covers the line where the
    // violation is reported.
    {
      code: `<template>
  <div
    class="x"
    {{! template-lint-disable no-invalid-interactive }}
    {{on "click" this.click}}
  ></div>
</template>`,
      output: `<template>
  {{! eslint-disable ember/template-no-invalid-interactive }}
  <div
    class="x"
    {{on "click" this.click}}
  ></div>
</template>`,
      errors: [{ messageId: 'convert' }],
    },
  ],
});
