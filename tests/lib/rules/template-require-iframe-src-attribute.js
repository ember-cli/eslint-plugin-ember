const rule = require('../../../lib/rules/template-require-iframe-src-attribute');
const RuleTester = require('eslint').RuleTester;

const ERROR_MESSAGE =
  'Security Risk: `<iframe>` must include a static `src` attribute. Otherwise, CSP `frame-src` is bypassed and `about:blank` inherits parent origin, creating an elevated-privilege frame.';

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-iframe-src-attribute', rule, {
  valid: [
    '<template><iframe src="about:blank"></iframe></template>',
    '<template><iframe src="/safe-path" {{this.setFrameElement}}></iframe></template>',
    '<template><iframe src="data:text/html,<h1>safe</h1>"></iframe></template>',
    '<template><iframe src=""></iframe></template>',
  ],
  invalid: [
    {
      code: '<template><iframe {{this.setFrameElement}}></iframe></template>',
      output: '<template><iframe src="about:blank" {{this.setFrameElement}}></iframe></template>',
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    },
    {
      code: '<template><iframe></iframe></template>',
      output: '<template><iframe src="about:blank"></iframe></template>',
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    },
    {
      code: '<template><iframe ...attributes id="foo"></iframe></template>',
      output: '<template><iframe ...attributes id="foo" src="about:blank"></iframe></template>',
      errors: [
        {
          message: ERROR_MESSAGE,
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

hbsRuleTester.run('template-require-iframe-src-attribute', rule, {
  valid: [
    '<iframe src="about:blank"></iframe>',
    '<iframe src="/safe-path" {{this.setFrameElement}}></iframe>',
    '<iframe src="data:text/html,<h1>safe</h1>"></iframe>',
    '<iframe src=""></iframe>',
  ],
  invalid: [
    {
      code: '<iframe {{this.setFrameElement}}></iframe>',
      output: '<iframe src="about:blank" {{this.setFrameElement}}></iframe>',
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    },
    {
      code: '<iframe></iframe>',
      output: '<iframe src="about:blank"></iframe>',
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    },
    {
      code: '<iframe ...attributes id="foo"></iframe>',
      output: '<iframe ...attributes id="foo" src="about:blank"></iframe>',
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    },
  ],
});
