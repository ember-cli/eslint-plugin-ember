const rule = require('../../../lib/rules/template-modifier-name-case');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-modifier-name-case', rule, {
  valid: [
    '<template><div {{did-insert}}></div></template>',
    '<template><div {{did-update}}></div></template>',
    '<template><div {{on-click}}></div></template>',
    '<template><div {{(modifier "did-insert")}}></div></template>',
    '<template><div {{(modifier "on-click")}}></div></template>',
  ],
  invalid: [
    {
      code: '<template><div {{didInsert}}></div></template>',
      output: '<template><div {{did-insert}}></div></template>',
      errors: [
        {
          message:
            'Use dasherized names for modifier invocation. Please replace `didInsert` with `did-insert`.',
        },
      ],
    },
    {
      code: '<template><div {{doSomething}}></div></template>',
      output: '<template><div {{do-something}}></div></template>',
      errors: [
        {
          message:
            'Use dasherized names for modifier invocation. Please replace `doSomething` with `do-something`.',
        },
      ],
    },
    {
      code: '<template><div {{fooBar}}></div></template>',
      output: '<template><div {{foo-bar}}></div></template>',
      errors: [
        {
          message:
            'Use dasherized names for modifier invocation. Please replace `fooBar` with `foo-bar`.',
        },
      ],
    },
    {
      code: '<template><div {{(modifier "didInsert")}}></div></template>',
      output: '<template><div {{(modifier "did-insert")}}></div></template>',
      errors: [
        {
          message:
            'Use dasherized names for modifier invocation. Please replace `didInsert` with `did-insert`.',
        },
      ],
    },
  ],
});
