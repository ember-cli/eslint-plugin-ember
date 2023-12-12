//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-restricted-resolver-tests');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGES } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('no-restricted-resolver-tests', rule, {
  valid: [
    `
    import { moduleFor } from 'ember-qunit';
    moduleFor('service:session', {
      ...foo,
      integration: true
    });
    `,
    `
    import { moduleForComponent } from 'ember-qunit';
    moduleForComponent('display-page', {
      integration: true
    });
    `,
    `
    import { moduleForModel } from 'ember-qunit';
    moduleForModel('post', {
      integration: true
    });
    `,
    `
    import { setupTest } from 'ember-qunit';
    setupTest('service:session', {
      integration: true
    });
    `,
    `
    import { setupComponentTest } from 'ember-mocha';
    setupComponentTest('display-page', {
      integration: true
    });
    `,
    `
    import { setupModelTest } from 'ember-mocha';
    setupModelTest('post', {
      integration: true
    });
    `,
    `
    module('foo', function(hooks) {
      setupTest(hooks);
    });
    `,
    "import { setupTest } from 'ember-qunit';",
    `
    const setupTest = require('ember-fastboot-addon-tests').setupTest;

    describe('Integration tests', function() {
      setupTest('fastboot-ready-app');
    });
    `,
  ],
  invalid: [
    {
      code: `import { moduleFor } from 'ember-qunit';

              moduleFor('service:session');
            `,
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
      output: null,
      errors: [
        {
          message: ERROR_MESSAGES.getNoPOJOWithoutIntegrationTrueMessage('setupModelTest'),
        },
      ],
    },
  ],
});
