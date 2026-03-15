//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-missing-invokable');
const RuleTester = require('eslint').RuleTester;

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

    // Built-in invokables are not reported when already imported
    `
      import { fn } from '@ember/helper';
      <template>
        {{fn myFunc 1}}
      </template>
    `,
    `
      import { LinkTo } from '@ember/routing';
      <template>
        <LinkTo @route="index">Home</LinkTo>
      </template>
    `,
  ],

  invalid: [
    // Subexpression invocations — always auto-fixes when invokable is configured
    {
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

    // Mustache Invocations — always auto-fixes when invokable is configured
    {
      code: `
      <template>
        {{eq 1 1}}
      </template>
    `,
      output: `import { eq } from 'ember-truth-helpers';

      <template>
        {{eq 1 1}}
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
    {
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

    // Modifier Invocations — always auto-fixes when invokable is configured
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

    // Multiple copies of a fixable invocation
    {
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

    // Auto-fix with a default export
    {
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

    // Built-in: fn — auto-fixes without any user config
    {
      code: `
      <template>
        {{fn myFunc 1}}
      </template>
      `,
      output: `import { fn } from '@ember/helper';

      <template>
        {{fn myFunc 1}}
      </template>
      `,
      errors: [{ type: 'GlimmerPathExpression', message: rule.meta.messages['missing-invokable'] }],
    },

    // Built-in: hash — auto-fixes without any user config
    {
      code: `
      <template>
        <MyComp @opts={{hash a=1}} />
      </template>
      `,
      output: `import { hash } from '@ember/helper';

      <template>
        <MyComp @opts={{hash a=1}} />
      </template>
      `,
      errors: [{ type: 'GlimmerPathExpression', message: rule.meta.messages['missing-invokable'] }],
    },

    // Built-in: on modifier — auto-fixes without any user config
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
      errors: [{ type: 'GlimmerPathExpression', message: rule.meta.messages['missing-invokable'] }],
    },

    // Built-in: LinkTo — auto-fixes without any user config
    {
      code: `
      <template>
        <LinkTo @route="index">Home</LinkTo>
      </template>
      `,
      output: `import { LinkTo } from '@ember/routing';

      <template>
        <LinkTo @route="index">Home</LinkTo>
      </template>
      `,
      errors: [{ type: 'GlimmerPathExpression', message: rule.meta.messages['missing-invokable'] }],
    },

    // User config overrides a built-in
    {
      code: `
        function doSomething() {}
        <template>
          <button {{on "click" doSomething}}>Go</button>
        </template>
      `,
      output: `import { on } from 'my-custom-modifier-package';

        function doSomething() {}
        <template>
          <button {{on "click" doSomething}}>Go</button>
        </template>
      `,
      options: [
        {
          invokables: {
            on: ['on', 'my-custom-modifier-package'],
          },
        },
      ],
      errors: [{ type: 'GlimmerPathExpression', message: rule.meta.messages['missing-invokable'] }],
    },
  ],
});
