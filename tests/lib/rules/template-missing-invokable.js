//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require('node:path');
const rule = require('../../../lib/rules/template-missing-invokable');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

// A filename inside a fixture project that has ember-truth-helpers installed.
const filenameInProjectWithTruthHelpers = path.join(
  __dirname,
  '../../fixtures/projects/has-ember-truth-helpers/test.gjs'
);

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-missing-invokable', rule, {
  valid: [
    // Subexpression Invocations
    `
      import { eq } from 'somewhere';
      <template>
        {{#if (eq 1 1)}}
          They're equal
        {{/if}}
      </template>
  `,
    `
      function eq() {}
      <template>
        {{#if (eq 1 1)}}
          They're equal
        {{/if}}
      </template>
    `,
    `
      function x(eq) {
        <template>
          {{#if (eq 1 1)}}
            They're equal
          {{/if}}
        </template>
      }
    `,

    // Mustache Invocations
    `
      import { eq } from 'somewhere';
      <template>
        {{eq 1 1}}
      </template>
    `,
    `
    import { eq } from 'somewhere';
    import MyComponent from 'somewhere';
    <template>
      <MyComponent @flag={{eq 1 1}} />
    </template>
    `,

    // Modifier Invocations
    `
    import { on } from 'somewhere';
    function doSomething() {}
    <template>
      <button {{on "click" doSomething}}>Go</button>
    </template>
  `,
  ],

  invalid: [
    // Subexpression invocations — no auto-fix when package is not in project deps
    {
      code: `
      <template>
        {{#if (eq 1 1)}}
          They're equal
        {{/if}}
      </template>
      `,
      output: null,
      options: [
        {
          invokables: {
            eq: ['eq', 'ember-truth-helpers'],
          },
        },
      ],

      errors: [{ type: 'GlimmerPathExpression', message: rule.meta.messages['missing-invokable'] }],
    },

    // Subexpression invocations — auto-fix when package IS in project deps
    {
      filename: filenameInProjectWithTruthHelpers,
      code: `
      <template>
        {{#if (eq 1 1)}}
          They're equal
        {{/if}}
      </template>
      `,
      output: `import { eq } from 'ember-truth-helpers';

      <template>
        {{#if (eq 1 1)}}
          They're equal
        {{/if}}
      </template>
      `,
      options: [
        {
          invokables: {
            eq: ['eq', 'ember-truth-helpers'],
          },
        },
      ],

      errors: [{ type: 'GlimmerPathExpression', message: rule.meta.messages['missing-invokable'] }],
    },

    // Mustache Invocations — no auto-fix when package is not in project deps
    {
      code: `
      <template>
        {{eq 1 1}}
      </template>
    `,
      output: null,
      options: [
        {
          invokables: {
            eq: ['eq', 'ember-truth-helpers'],
          },
        },
      ],
      errors: [{ type: 'GlimmerPathExpression', message: rule.meta.messages['missing-invokable'] }],
    },
    {
      filename: filenameInProjectWithTruthHelpers,
      code: `
      import MyComponent from 'somewhere';
      <template>
        <MyComponent @flag={{eq 1 1}} />
      </template>
    `,
      output: `import { eq } from 'ember-truth-helpers';

      import MyComponent from 'somewhere';
      <template>
        <MyComponent @flag={{eq 1 1}} />
      </template>
    `,
      options: [
        {
          invokables: {
            eq: ['eq', 'ember-truth-helpers'],
          },
        },
      ],
      errors: [{ type: 'GlimmerPathExpression', message: rule.meta.messages['missing-invokable'] }],
    },

    // Modifier Invocations — built-in package always auto-fixes
    {
      code: `
        function doSomething() {}
        <template>
          <button {{on "click" doSomething}}>Go</button>
        </template>
      `,
      output: `import { on } from '@ember/modifier';

        function doSomething() {}
        <template>
          <button {{on "click" doSomething}}>Go</button>
        </template>
      `,
      options: [
        {
          invokables: {
            on: ['on', '@ember/modifier'],
          },
        },
      ],
      errors: [{ type: 'GlimmerPathExpression', message: rule.meta.messages['missing-invokable'] }],
    },

    // Multiple copies of a fixable invocation — with package installed
    {
      filename: filenameInProjectWithTruthHelpers,
      code: `
        let other = <template>
          {{#if (eq 3 3) }}
            three is three
          {{/if}}
        </template>

        <template>
          {{#if (eq 1 1) }}
            one is one
          {{/if}}
          {{#if (eq 2 2) }}
            two is two
          {{/if}}
        </template>
      `,
      output: `import { eq } from 'ember-truth-helpers';

        let other = <template>
          {{#if (eq 3 3) }}
            three is three
          {{/if}}
        </template>

        <template>
          {{#if (eq 1 1) }}
            one is one
          {{/if}}
          {{#if (eq 2 2) }}
            two is two
          {{/if}}
        </template>
      `,
      options: [
        {
          invokables: {
            eq: ['eq', 'ember-truth-helpers'],
          },
        },
      ],
      errors: [
        { type: 'GlimmerPathExpression', message: rule.meta.messages['missing-invokable'] },
        { type: 'GlimmerPathExpression', message: rule.meta.messages['missing-invokable'] },
        { type: 'GlimmerPathExpression', message: rule.meta.messages['missing-invokable'] },
      ],
    },

    // Auto-fix with a default export — package installed
    {
      filename: filenameInProjectWithTruthHelpers,
      code: `
      <template>
        {{#if (eq 1 1)}}
          They're equal
        {{/if}}
      </template>
      `,
      output: `import eq from 'ember-truth-helpers/helpers/equal';

      <template>
        {{#if (eq 1 1)}}
          They're equal
        {{/if}}
      </template>
      `,
      options: [
        {
          invokables: {
            eq: ['default', 'ember-truth-helpers/helpers/equal'],
          },
        },
      ],

      errors: [{ type: 'GlimmerPathExpression', message: rule.meta.messages['missing-invokable'] }],
    },
  ],
});
