'use strict';

const rule = require('../../../lib/rules/template-require-each-key');
const RuleTester = require('../../eslint-rule-tester').default;

const ruleTester = new RuleTester();

ruleTester.run('template-require-each-key', rule, {
  valid: [
    '<template>{{#each items key="id" as |item|}}{{item.name}}{{/each}}</template>',
    '<template>{{#each items key="@index" as |item|}}{{item.name}}{{/each}}</template>',
    '<template><div>No each block</div></template>',
  ],
  invalid: [
    {
      code: '<template>{{#each items as |item|}}{{item.name}}{{/each}}</template>',
      output: null,
      errors: [{ messageId: 'requireEachKey' }],
    },
  ],
});
