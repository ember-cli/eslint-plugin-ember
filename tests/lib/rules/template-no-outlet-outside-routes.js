'use strict';

const rule = require('../../../lib/rules/template-no-outlet-outside-routes');
const RuleTester = require('../../eslint-rule-tester').default;

const ruleTester = new RuleTester();

ruleTester.run('template-no-outlet-outside-routes', rule, {
  valid: ['<template><div>Content</div></template>'],
  invalid: [
    {
      code: '<template>{{outlet}}</template>',
      output: null,
      errors: [{ messageId: 'noOutletOutsideRoutes' }],
    },
    {
      code: '<template><div>{{outlet}}</div></template>',
      output: null,
      errors: [{ messageId: 'noOutletOutsideRoutes' }],
    },
  ],
});
