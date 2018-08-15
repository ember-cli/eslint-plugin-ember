//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-restricted-resolver-tests');
const RuleTester = require('eslint').RuleTester;

const parserOptions = { ecmaVersion: 6, sourceType: 'module' };
const messages = rule.meta.messages;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('no-restricted-resolver-tests', rule, {
  valid: [
    {
      code: `
              moduleFor('service:session', {
                integration: true
              });
            `,
      parserOptions,
    },
    {
      code: `
              moduleForComponent('display-page', {
                integration: true
              });
            `,
      parserOptions,
    },
    {
      code: `
              moduleForModel('post', {
                integration: true
              });
            `,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `
              moduleFor('service:session');
            `,
      parserOptions,
      errors: [
        {
          message: messages.getSingleStringArgumentMessage('moduleFor')
        },
      ],
    },
    {
      code: `
              moduleFor('service:session', {
                unit: true
              });
            `,
      parserOptions,
      errors: [
        {
          message: messages.getNoUnitTrueMessage('moduleFor')
        },
      ],
    },
    {
      code: `
              moduleFor('service:session', {
                needs: ['type:thing']
              });
            `,
      parserOptions,
      errors: [
        {
          message: messages.getNoNeedsMessage('moduleFor')
        },
      ],
    },
    {
      code: `
              moduleFor('service:session', arg2, {});
            `,
      parserOptions,
      errors: [
        {
          message: messages.getNoPOJOWithoutIntegrationTrueMessage('moduleFor')
        },
      ],
    },
    {
      code: `
              moduleForComponent('display-page');
            `,
      parserOptions,
      errors: [
        {
          message: messages.getSingleStringArgumentMessage('moduleForComponent')
        },
      ],
    },
    {
      code: `
              moduleForComponent('display-page', {
                unit: true
              });
            `,
      parserOptions,
      errors: [
        {
          message: messages.getNoUnitTrueMessage('moduleForComponent')
        },
      ],
    },
    {
      code: `
              moduleForComponent('display-page', {
                needs: ['type:thing']
              });
            `,
      parserOptions,
      errors: [
        {
          message: messages.getNoNeedsMessage('moduleForComponent')
        },
      ],
    },
    {
      code: `
              moduleForComponent('display-page', arg2, {});
            `,
      parserOptions,
      errors: [
        {
          message: messages.getNoPOJOWithoutIntegrationTrueMessage('moduleForComponent')
        },
      ],
    },
    {
      code: `
              moduleForModel('post');
            `,
      parserOptions,
      errors: [
        {
          message: messages.getSingleStringArgumentMessage('moduleForModel')
        },
      ],
    },
    {
      code: `
              moduleForModel('post', {
                unit: true
              });
            `,
      parserOptions,
      errors: [
        {
          message: messages.getNoUnitTrueMessage('moduleForModel')
        },
      ],
    },
    {
      code: `
              moduleForModel('post', {
                needs: ['type:thing']
              });
            `,
      parserOptions,
      errors: [
        {
          message: messages.getNoNeedsMessage('moduleForModel')
        },
      ],
    },
    {
      code: `
              moduleForModel('post', arg2, {});
            `,
      parserOptions,
      errors: [
        {
          message: messages.getNoPOJOWithoutIntegrationTrueMessage('moduleForModel')
        },
      ],
    },
  ],
});
