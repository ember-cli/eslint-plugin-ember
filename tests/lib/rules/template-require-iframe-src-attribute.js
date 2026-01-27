const rule = require('../../../lib/rules/template-require-iframe-src-attribute');
const RuleTester = require('eslint').RuleTester;

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
      code: '<template><iframe></iframe></template>',
      output: null,
      errors: [
        {
          message:
            'Security Risk: `<iframe>` must include a static `src` attribute. Otherwise, CSP `frame-src` is bypassed and `about:blank` inherits parent origin, creating an elevated-privilege frame.',
        },
      ],
    },
    {
      code: '<template><iframe {{this.setFrameElement}}></iframe></template>',
      output: null,
      errors: [
        {
          message:
            'Security Risk: `<iframe>` must include a static `src` attribute. Otherwise, CSP `frame-src` is bypassed and `about:blank` inherits parent origin, creating an elevated-privilege frame.',
        },
      ],
    },
    {
      code: '<template><iframe ...attributes id="foo"></iframe></template>',
      output: null,
      errors: [
        {
          message:
            'Security Risk: `<iframe>` must include a static `src` attribute. Otherwise, CSP `frame-src` is bypassed and `about:blank` inherits parent origin, creating an elevated-privilege frame.',
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
      output: null,
      errors: [
        {
          message:
            'Security Risk: `<iframe>` must include a static `src` attribute. Otherwise, CSP `frame-src` is bypassed and `about:blank` inherits parent origin, creating an elevated-privilege frame.',
        },
      ],
    },
    {
      code: '<iframe></iframe>',
      output: null,
      errors: [
        {
          message:
            'Security Risk: `<iframe>` must include a static `src` attribute. Otherwise, CSP `frame-src` is bypassed and `about:blank` inherits parent origin, creating an elevated-privilege frame.',
        },
      ],
    },
    {
      code: '<iframe ...attributes id="foo"></iframe>',
      output: null,
      errors: [
        {
          message:
            'Security Risk: `<iframe>` must include a static `src` attribute. Otherwise, CSP `frame-src` is bypassed and `about:blank` inherits parent origin, creating an elevated-privilege frame.',
        },
      ],
    },
  ],
});
