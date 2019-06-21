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
          message: messages.getSingleStringArgumentMessage('moduleFor'),
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
          message: messages.getNoUnitTrueMessage('moduleFor'),
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
          message: messages.getNoNeedsMessage('moduleFor'),
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
          message: messages.getNoPOJOWithoutIntegrationTrueMessage('moduleFor'),
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
          message: messages.getSingleStringArgumentMessage('moduleForComponent'),
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
          message: messages.getNoUnitTrueMessage('moduleForComponent'),
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
          message: messages.getNoNeedsMessage('moduleForComponent'),
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
          message: messages.getNoPOJOWithoutIntegrationTrueMessage('moduleForComponent'),
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
          message: messages.getSingleStringArgumentMessage('moduleForModel'),
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
          message: messages.getNoUnitTrueMessage('moduleForModel'),
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
          message: messages.getNoNeedsMessage('moduleForModel'),
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
          message: messages.getNoPOJOWithoutIntegrationTrueMessage('moduleForModel'),
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
          message: messages.getSingleStringArgumentMessage('setupTest'),
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
          message: messages.getNoUnitTrueMessage('setupTest'),
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
          message: messages.getNoNeedsMessage('setupTest'),
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
          message: messages.getNoPOJOWithoutIntegrationTrueMessage('setupTest'),
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
          message: messages.getSingleStringArgumentMessage('setupComponentTest'),
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
          message: messages.getNoUnitTrueMessage('setupComponentTest'),
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
          message: messages.getNoNeedsMessage('setupComponentTest'),
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
          message: messages.getNoPOJOWithoutIntegrationTrueMessage('setupComponentTest'),
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
          message: messages.getSingleStringArgumentMessage('setupModelTest'),
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
          message: messages.getNoUnitTrueMessage('setupModelTest'),
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
          message: messages.getNoNeedsMessage('setupModelTest'),
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
          message: messages.getNoPOJOWithoutIntegrationTrueMessage('setupModelTest'),
        },
      ],
    },
  ],
});
