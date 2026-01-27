const rule = require('../../../lib/rules/template-no-args-paths');
const RuleTester = require('eslint').RuleTester;
const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-args-paths', rule, {
  valid: ['<template>{{@foo}}</template>'],
  invalid: [
    { code: '<template>{{@args.foo}}</template>', errors: [{ messageId: 'argsPath' }] },
  ],
});
