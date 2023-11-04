// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/named-functions-in-promises');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 2022 },
});

eslintTester.run('named-functions-in-promises', rule, {
  valid: [
    'user.save().then(this._reloadUser.bind(this));',
    'user.save().catch(this._handleError.bind(this));',
    'user.save().finally(this._finallyDo.bind(this));',
    'user.save().then(this._reloadUser);',
    'user.save().catch(this._handleError);',
    'user.save().finally(this._finallyDo);',
    'user.save().then(_reloadUser);',
    'user.save().catch(_handleError);',
    'user.save().finally(_finallyDo);',
    {
      code: 'user.save().then(() => this._reloadUser(user));',
      options: [
        {
          allowSimpleArrowFunction: true,
        },
      ],
    },
    {
      code: 'user.save().catch(err => this._handleError(err));',
      options: [
        {
          allowSimpleArrowFunction: true,
        },
      ],
    },
    {
      code: 'user.save().finally(() => this._finallyDo());',
      options: [
        {
          allowSimpleArrowFunction: true,
        },
      ],
    },
    {
      code: 'user.save().then(() => user.reload());',
      options: [
        {
          allowSimpleArrowFunction: true,
        },
      ],
    },
  ],
  invalid: [
    {
      code: 'user.save().then(() => {return user.reload();});',
      output: null,
      errors: [
        {
          message: 'Use named functions defined on objects to handle promises',
        },
      ],
    },
    {
      code: 'user.save().catch(() => {return error.handle();});',
      output: null,
      errors: [
        {
          message: 'Use named functions defined on objects to handle promises',
        },
      ],
    },
    {
      code: 'user.save().finally(() => {return finallyDo();});',
      output: null,
      errors: [
        {
          message: 'Use named functions defined on objects to handle promises',
        },
      ],
    },
    {
      code: 'user.save().then(() => {return user.reload();});',
      output: null,
      options: [
        {
          allowSimpleArrowFunction: true,
        },
      ],
      errors: [
        {
          message: 'Use named functions defined on objects to handle promises',
        },
      ],
    },
    {
      code: 'user.save().catch(() => {return error.handle();});',
      output: null,
      options: [
        {
          allowSimpleArrowFunction: true,
        },
      ],
      errors: [
        {
          message: 'Use named functions defined on objects to handle promises',
        },
      ],
    },
    {
      code: 'user.save().finally(() => {return finallyDo();});',
      output: null,
      options: [
        {
          allowSimpleArrowFunction: true,
        },
      ],
      errors: [
        {
          message: 'Use named functions defined on objects to handle promises',
        },
      ],
    },
    {
      code: 'user.save().then(() => this._reloadUser(user));',
      output: null,
      errors: [
        {
          message: 'Use named functions defined on objects to handle promises',
        },
      ],
    },
    {
      code: 'user.save().catch(err => this._handleError(err));',
      output: null,
      errors: [
        {
          message: 'Use named functions defined on objects to handle promises',
        },
      ],
    },
    {
      code: 'user.save().finally(() => this._finallyDo());',
      output: null,
      errors: [
        {
          message: 'Use named functions defined on objects to handle promises',
        },
      ],
    },
    {
      code: 'user.save().then(() => user.reload());',
      output: null,
      errors: [
        {
          message: 'Use named functions defined on objects to handle promises',
        },
      ],
    },
    {
      code: 'user.save().then(user => user.name);',
      output: null,
      options: [
        {
          allowSimpleArrowFunction: true,
        },
      ],
      errors: [
        {
          message: 'Use named functions defined on objects to handle promises',
        },
      ],
    },
  ],
});
