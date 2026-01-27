const rule = require('../../../lib/rules/template-simple-modifiers');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-simple-modifiers', rule, {
  valid: [
    '<template><div {{(modifier "track-interaction" @controlName)}}></div></template>',
    '<template><div {{(modifier this.trackInteraction @controlName)}}></div></template>',
    '<template><div {{my-modifier}}></div></template>',
  ],
  invalid: [
    {
      code: '<template><div {{(modifier)}}></div></template>',
      output: null,
      errors: [
        {
          message:
            'The modifier helper should have a string or a variable name containing the modifier name as a first argument.',
        },
      ],
    },
  ],
});
