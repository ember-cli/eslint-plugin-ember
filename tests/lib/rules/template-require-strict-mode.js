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

    {
      filename: 'hello.hbs',
      code: `<template><div>
  hello
</div></template>`,
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

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-require-strict-mode', rule, {
  valid: [
    '<template>hello</template>',
    `import Component from '@glimmer/component';

  export default class HelloComponent extends Component {
    <template>hello</template>
  }`,
  ],
  invalid: [
  ],
});
