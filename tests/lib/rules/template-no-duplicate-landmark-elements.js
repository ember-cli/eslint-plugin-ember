const rule = require('../../../lib/rules/template-no-duplicate-landmark-elements');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-duplicate-landmark-elements', rule, {
  valid: [
    '<template><header aria-label="Main">Header</header></template>',
    '<template><nav aria-label="Primary">Nav 1</nav><nav aria-label="Secondary">Nav 2</nav></template>',
    '<template><main>Content</main></template>',
  ],

  invalid: [
    {
      code: '<template><nav>Nav 1</nav><nav>Nav 2</nav></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><header>Header 1</header><header>Header 2</header></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><aside>Side 1</aside><aside>Side 2</aside></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
  ],
});
