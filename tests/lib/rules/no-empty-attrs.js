'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-empty-attrs');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new RuleTester();
eslintTester.run('no-empty-attrs', rule, {
  valid: [
    {
      code: 'export default Model.extend();',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Model.extend({name: attr("string"), points: attr("number"), dob: attr("date")});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Model.extend({name: attr("string")});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `someArrayOfStrings.filter(function(attr) {
        return attr.underscore();
      });`,
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `export default Model.extend({
        someArray: someArrayOfStrings.filter(function(attr) {
          return attr.underscore();
        }),
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
  ],
  invalid: [
    {
      code: 'export default Model.extend({name: attr(), points: attr("number"), dob: attr("date")});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Supply proper attribute type',
      }],
    },
    {
      code: 'export default Model.extend({name: attr("string"), points: attr("number"), dob: attr()});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Supply proper attribute type',
      }],
    }
  ]
});
