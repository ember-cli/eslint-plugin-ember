'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-capital-letters-in-routes');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' }
});
eslintTester.run('no-capital-letters-in-routes', rule, {

  valid: [
    'this.route("sign-in");',
    'this.route("news", { path: "/:news_id" });',
    {
      code: `
        const routeName="about";
        this.route(routeName);
        this.route(DASH_TAB.ACTIVITY);`,
    },
  ],

  invalid: [{
    code: 'this.route("Sign-in");',
    output: null,
    errors: [{
      message: 'Unexpected capital letter in route\'s name',
    }]
  }, {
    code: 'this.route("hOme");',
    output: null,
    errors: [{
      message: 'Unexpected capital letter in route\'s name',
    }]
  }, {
    code: 'this.route("DASH_TAB.ACTIVITY");',
    output: null,
    errors: [{
      message: 'Unexpected capital letter in route\'s name',
    }]
  }],
});
