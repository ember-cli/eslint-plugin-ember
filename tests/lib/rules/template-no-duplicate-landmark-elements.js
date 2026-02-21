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
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><nav></nav><nav></nav></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><nav></nav><div role="navigation"></div></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><nav></nav><nav aria-label="secondary navigation"></nav></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><main></main><div role="main"></div></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><nav aria-label="site navigation"></nav><nav aria-label="site navigation"></nav></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><form aria-label="search-form"></form><form aria-label="search-form"></form></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><form aria-labelledby="form-title"></form><form aria-labelledby="form-title"></form></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
  ],
});
