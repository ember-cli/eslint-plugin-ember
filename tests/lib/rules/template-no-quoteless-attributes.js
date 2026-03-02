const rule = require('../../../lib/rules/template-no-quoteless-attributes');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-quoteless-attributes', rule, {
  valid: [
    '<template><div class="foo"></div></template>',
    '<template><div data-foo="derp"></div></template>',
    '<template><div data-foo="derp {{stuff}}"></div></template>',
    '<template><div data-foo={{someValue}}></div></template>',
    '<template><div data-foo={{true}}></div></template>',
    '<template><div data-foo={{false}}></div></template>',
    '<template><div data-foo={{5}}></div></template>',
    '<template><SomeThing ...attributes /></template>',
    '<template><div></div></template>',
    '<template><input disabled></template>',
  ],
  invalid: [
    {
      code: '<template><div class=foo></div></template>',
      output: '<template><div class="foo"></div></template>',
      errors: [{ messageId: 'missing' }],
    },

    {
      code: '<template><div data-foo=asdf></div></template>',
      output: '<template><div data-foo="asdf"></div></template>',
      errors: [{ messageId: 'missing' }],
    },
    {
      code: '<template><SomeThing @blah=asdf /></template>',
      output: '<template><SomeThing @blah="asdf" /></template>',
      errors: [{ messageId: 'missing' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-quoteless-attributes', rule, {
  valid: [
    '<div data-foo="derp"></div>',
    '<div data-foo="derp {{stuff}}"></div>',
    '<div data-foo={{someValue}}></div>',
    '<div data-foo={{true}}></div>',
    '<div data-foo={{false}}></div>',
    '<div data-foo={{5}}></div>',
    '<SomeThing ...attributes />',
    '<div></div>',
    '<input disabled>',
  ],
  invalid: [
    {
      code: '<div data-foo=asdf></div>',
      output: '<div data-foo="asdf"></div>',
      errors: [
        { message: 'Attribute data-foo should be either quoted or wrapped in mustaches' },
      ],
    },
    {
      code: '<SomeThing @blah=asdf />',
      output: '<SomeThing @blah="asdf" />',
      errors: [
        { message: 'Argument @blah should be either quoted or wrapped in mustaches' },
      ],
    },
  ],
});
