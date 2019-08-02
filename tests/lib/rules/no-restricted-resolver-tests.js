//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-restricted-resolver-tests');
const RuleTester = require('eslint').RuleTester;

const parserOptions = { ecmaVersion: 6, sourceType: 'module' };
const { ERROR_MESSAGES } = rule;

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
    {
      code: `
              setupTest('service:session', {
                integration: true
              });
            `,
      parserOptions,
    },
    {
      code: `
              setupComponentTest('display-page', {
                integration: true
              });
            `,
      parserOptions,
    },
    {
      code: `
              setupModelTest('post', {
                integration: true
              });
            `,
      parserOptions,
    },
    {
      code: `
              module('foo', function(hooks) {
                setupTest(hooks);
              });
            `,
      parserOptions,
    },
    {
      code: "import { setupTest } from 'ember-qunit';",
      parserOptions,
    },
    {
      code: `const setupTest = require('ember-fastboot-addon-tests').setupTest;

            describe('Integration tests', function() {
              setupTest('fastboot-ready-app');
            });`,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `import { moduleFor } from 'ember-qunit';

              moduleFor('service:session');
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getSingleStringArgumentMessage('moduleFor'),
        },
      ],
    },
    {
      code: `import { moduleFor } from 'ember-qunit';

              moduleFor('service:session', {
                unit: true
              });
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getNoUnitTrueMessage('moduleFor'),
        },
      ],
    },
    {
      code: `import { moduleFor } from 'ember-qunit';

              moduleFor('service:session', {
                needs: ['type:thing']
              });
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getNoNeedsMessage('moduleFor'),
        },
      ],
    },
    {
      code: `import { moduleFor } from 'ember-qunit';

              moduleFor('service:session', arg2, {});
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getNoPOJOWithoutIntegrationTrueMessage('moduleFor'),
        },
      ],
    },
    {
      code: `import { moduleForComponent } from 'ember-qunit';

              moduleForComponent('display-page');
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getSingleStringArgumentMessage('moduleForComponent'),
        },
      ],
    },
    {
      code: `import { moduleForComponent } from 'ember-qunit';

              moduleForComponent('display-page', {
                unit: true
              });
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getNoUnitTrueMessage('moduleForComponent'),
        },
      ],
    },
    {
      code: `import { moduleForComponent } from 'ember-qunit';

              moduleForComponent('display-page', {
                needs: ['type:thing']
              });
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getNoNeedsMessage('moduleForComponent'),
        },
      ],
    },
    {
      code: `import { moduleForComponent } from 'ember-qunit';

              moduleForComponent('display-page', arg2, {});
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getNoPOJOWithoutIntegrationTrueMessage('moduleForComponent'),
        },
      ],
    },
    {
      code: `import { moduleForModel } from 'ember-qunit';

              moduleForModel('post');
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getSingleStringArgumentMessage('moduleForModel'),
        },
      ],
    },
    {
      code: `import { moduleForModel } from 'ember-qunit';

              moduleForModel('post', {
                unit: true
              });
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getNoUnitTrueMessage('moduleForModel'),
        },
      ],
    },
    {
      code: `import { moduleForModel } from 'ember-qunit';

              moduleForModel('post', {
                needs: ['type:thing']
              });
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getNoNeedsMessage('moduleForModel'),
        },
      ],
    },
    {
      code: `import { moduleForModel } from 'ember-qunit';

              moduleForModel('post', arg2, {});
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getNoPOJOWithoutIntegrationTrueMessage('moduleForModel'),
        },
      ],
    },
    {
      code: `import { setupTest } from 'ember-mocha';

              setupTest('service:session');
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getSingleStringArgumentMessage('setupTest'),
        },
      ],
    },
    {
      code: `import { setupTest } from 'ember-mocha';

              setupTest('service:session', {
                unit: true
              });
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getNoUnitTrueMessage('setupTest'),
        },
      ],
    },
    {
      code: `import { setupTest } from 'ember-mocha';

              setupTest('service:session', {
                needs: ['type:thing']
              });
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getNoNeedsMessage('setupTest'),
        },
      ],
    },
    {
      code: `import { setupTest } from 'ember-mocha';

              setupTest('service:session', arg2, {});
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getNoPOJOWithoutIntegrationTrueMessage('setupTest'),
        },
      ],
    },
    {
      code: `import { setupComponentTest } from 'ember-mocha';

              setupComponentTest('display-page');
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getSingleStringArgumentMessage('setupComponentTest'),
        },
      ],
    },
    {
      code: `import { setupComponentTest } from 'ember-mocha';

              setupComponentTest('display-page', {
                unit: true
              });
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getNoUnitTrueMessage('setupComponentTest'),
        },
      ],
    },
    {
      code: `import { setupComponentTest } from 'ember-mocha';

              setupComponentTest('display-page', {
                needs: ['type:thing']
              });
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getNoNeedsMessage('setupComponentTest'),
        },
      ],
    },
    {
      code: `import { setupComponentTest } from 'ember-mocha';

              setupComponentTest('display-page', arg2, {});
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getNoPOJOWithoutIntegrationTrueMessage('setupComponentTest'),
        },
      ],
    },
    {
      code: `import { setupModelTest } from 'ember-mocha';

              setupModelTest('post');
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getSingleStringArgumentMessage('setupModelTest'),
        },
      ],
    },
    {
      code: `import { setupModelTest } from 'ember-mocha';

              setupModelTest('post', {
                unit: true
              });
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getNoUnitTrueMessage('setupModelTest'),
        },
      ],
    },
    {
      code: `import { setupModelTest } from 'ember-mocha';

              setupModelTest('post', {
                needs: ['type:thing']
              });
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getNoNeedsMessage('setupModelTest'),
        },
      ],
    },
    {
      code: `import { setupModelTest } from 'ember-mocha';

              setupModelTest('post', arg2, {});
            `,
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getNoPOJOWithoutIntegrationTrueMessage('setupModelTest'),
        },
      ],
    },
  ],
});
