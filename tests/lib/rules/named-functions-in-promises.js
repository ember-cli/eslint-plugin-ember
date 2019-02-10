// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/named-functions-in-promises');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
eslintTester.run('named-functions-in-promises', rule, {
  valid: [
    {
      code: 'user.save().then(this._reloadUser.bind(this));',
      parserOptions: { ecmaVersion: 6 },
    }, {
      code: 'user.save().catch(this._handleError.bind(this));',
      parserOptions: { ecmaVersion: 6 },
    }, {
      code: 'user.save().finally(this._finallyDo.bind(this));',
      parserOptions: { ecmaVersion: 6 },
    }, {
      code: 'user.save().then(this._reloadUser);',
      parserOptions: { ecmaVersion: 6 },
    }, {
      code: 'user.save().catch(this._handleError);',
      parserOptions: { ecmaVersion: 6 },
    }, {
      code: 'user.save().finally(this._finallyDo);',
      parserOptions: { ecmaVersion: 6 },
    }, {
      code: 'user.save().then(_reloadUser);',
      parserOptions: { ecmaVersion: 6 },
    }, {
      code: 'user.save().catch(_handleError);',
      parserOptions: { ecmaVersion: 6 },
    }, {
      code: 'user.save().finally(_finallyDo);',
      parserOptions: { ecmaVersion: 6 },
    }, {
      code: 'user.save().then(() => this._reloadUser(user));',
      parserOptions: { ecmaVersion: 6 },
      options: [{
        allowSimpleArrowFunction: true,
      }],
    }, {
      code: 'user.save().catch(err => this._handleError(err));',
      parserOptions: { ecmaVersion: 6 },
      options: [{
        allowSimpleArrowFunction: true,
      }],
    }, {
      code: 'user.save().finally(() => this._finallyDo());',
      parserOptions: { ecmaVersion: 6 },
      options: [{
        allowSimpleArrowFunction: true,
      }],
    }, {
      code: 'user.save().then(() => user.reload());',
      parserOptions: { ecmaVersion: 6 },
      options: [{
        allowSimpleArrowFunction: true,
      }],
    },
  ],
  invalid: [
    {
      code: 'user.save().then(() => {return user.reload();});',
      parserOptions: { ecmaVersion: 6 },
      output: null,
      errors: [{
        message: 'Use named functions defined on objects to handle promises',
      }],
    }, {
      code: 'user.save().catch(() => {return error.handle();});',
      parserOptions: { ecmaVersion: 6 },
      output: null,
      errors: [{
        message: 'Use named functions defined on objects to handle promises',
      }],
    }, {
      code: 'user.save().finally(() => {return finallyDo();});',
      parserOptions: { ecmaVersion: 6 },
      output: null,
      errors: [{
        message: 'Use named functions defined on objects to handle promises',
      }],
    }, {
      code: 'user.save().then(() => {return user.reload();});',
      parserOptions: { ecmaVersion: 6 },
      options: [{
        allowSimpleArrowFunction: true,
      }],
      output: null,
      errors: [{
        message: 'Use named functions defined on objects to handle promises',
      }],
    }, {
      code: 'user.save().catch(() => {return error.handle();});',
      parserOptions: { ecmaVersion: 6 },
      options: [{
        allowSimpleArrowFunction: true,
      }],
      output: null,
      errors: [{
        message: 'Use named functions defined on objects to handle promises',
      }],
    }, {
      code: 'user.save().finally(() => {return finallyDo();});',
      parserOptions: { ecmaVersion: 6 },
      options: [{
        allowSimpleArrowFunction: true,
      }],
      output: null,
      errors: [{
        message: 'Use named functions defined on objects to handle promises',
      }],
    }, {
      code: 'user.save().then(() => this._reloadUser(user));',
      parserOptions: { ecmaVersion: 6 },
      output: null,
      errors: [{
        message: 'Use named functions defined on objects to handle promises',
      }],
    }, {
      code: 'user.save().catch(err => this._handleError(err));',
      parserOptions: { ecmaVersion: 6 },
      output: null,
      errors: [{
        message: 'Use named functions defined on objects to handle promises',
      }],
    }, {
      code: 'user.save().finally(() => this._finallyDo());',
      parserOptions: { ecmaVersion: 6 },
      output: null,
      errors: [{
        message: 'Use named functions defined on objects to handle promises',
      }],
    }, {
      code: 'user.save().then(() => user.reload());',
      parserOptions: { ecmaVersion: 6 },
      output: null,
      errors: [{
        message: 'Use named functions defined on objects to handle promises',
      }],
    }, {
      code: 'user.save().then(user => user.name);',
      parserOptions: { ecmaVersion: 6 },
      options: [{
        allowSimpleArrowFunction: true,
      }],
      output: null,
      errors: [{
        message: 'Use named functions defined on objects to handle promises',
      }],
    }
  ],
});
