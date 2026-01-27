const rule = require('../../../lib/rules/template-require-strict-mode');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-strict-mode', rule, {
  valid: [
    {
      filename: 'hello.gjs',
      code: '<template>hello</template>',
    },
  ],
  invalid: [
    {
      filename: 'hello.hbs',
      code: '<template><div>hello</div></template>',
      output: null,
      errors: [
        {
          message:
            'Templates are required to be in strict mode. Consider refactoring to template tag format.',
        },
      ],
    },
  ],
});
