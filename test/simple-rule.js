'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../rules/simple-rule');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new RuleTester();
// eslintTester.run('simple-rule', rule, {
//     valid: [
//       '',
//     ],
//     invalid: [
//         {code: '', errors: [{message: ''}]},
//     ]
// });
