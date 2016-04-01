'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../rules/local-modules');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new RuleTester();
// eslintTester.run('local-modules', rule, {
//     valid: [
//       '',
//     ],
//     invalid: [
//         {code: '', errors: [{message: ''}]},
//     ]
// });
