const rule = require('../../../lib/rules/template-eol-last');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-eol-last', rule, {
  valid: [
    '<template>\n  <div>Hello</div>\n</template>\n',
    {
      code: '<template>\n  <div>Hello</div>\n</template>',
      options: ['never'],
    },
    '<template><div>Hello</div></template>\n',
  ],

  invalid: [
    {
      code: '<template>\n  <div>Hello</div>\n</template>',
      output: '<template>\n  <div>Hello</div>\n</template>\n',
      errors: [{ messageId: 'missing' }],
    },
    {
      code: '<template><div>Hello</div></template>',
      output: '<template><div>Hello</div></template>\n',
      errors: [{ messageId: 'missing' }],
    },
    {
      code: '<template>\n  <div>Hello</div>\n</template>\n',
      output: '<template>\n  <div>Hello</div>\n</template>',
      options: ['never'],
      errors: [{ messageId: 'unexpected' }],
    },
  ],
});
