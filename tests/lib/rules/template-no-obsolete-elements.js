const rule = require('../../../lib/rules/template-no-obsolete-elements');
const RuleTester = require('eslint').RuleTester;
const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-obsolete-elements', rule, {
  valid: ['<template><div></div></template>'],
  invalid: [
    { code: '<template><marquee></marquee></template>', errors: [{ messageId: 'obsolete' }] },
  ],
});
