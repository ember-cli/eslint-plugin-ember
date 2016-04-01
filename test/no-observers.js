'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../rules/no-observers');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new RuleTester();
// eslintTester.run('no-observers', rule, {
//     valid: [
//       '',
//     ],
//     invalid: [
//         {code: '', errors: [{message: ''}]},
//     ]
// });
