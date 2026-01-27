const rule = require('../../../lib/rules/template-no-invalid-meta');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-invalid-meta', rule, {
  valid: [
    '<template><meta charset="utf-8" /></template>',
    '<template><meta charset="UTF-8" /></template>',
    '<template><meta charset="utf8" /></template>',
    '<template><meta name="viewport" content="width=device-width" /></template>',

    // Bare meta (no attrs)
    '<template><meta></template>',

    // Valid http-equiv refresh (delay=0 for redirect, >72000)
    '<template><meta http-equiv="refresh" content="0; url=http://www.example.com"></template>',
    '<template><meta http-equiv="refresh" content="72001"></template>',

    // Dynamic attributes (can't validate at lint time)
    '<template><meta http-equiv={{httpEquiv}} content={{content}}></template>',
    '<template><meta name={{name}} content={{content}}></template>',

    // Viewport with user-scalable=yes (valid)
    '<template><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes"></template>',
    '<template><meta name="viewport" content="width=device-width, initial-scale=1"></template>',

    // property and itemprop with content (valid)
    '<template><meta property="og:type" content="website"></template>',
    '<template><meta itemprop="type" content="website"></template>',
  ],

  invalid: [
    {
      code: '<template><meta charset="iso-8859-1" /></template>',
      output: null,
      errors: [
        {
          message: 'Meta charset should be "utf-8". Found: "iso-8859-1".',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: '<template><meta charset="latin1" /></template>',
      output: null,
      errors: [
        {
          message: 'Meta charset should be "utf-8". Found: "latin1".',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: '<template><meta charset="windows-1252" /></template>',
      output: null,
      errors: [
        {
          message: 'Meta charset should be "utf-8". Found: "windows-1252".',
          type: 'GlimmerElementNode',
        },
      ],
    },

    {
      code: '<template><meta http-equiv="refresh" content="1; url=http://www.example.com"></template>',
      output: null,
      errors: [{ messageId: 'metaRefreshRedirect' }],
    },
    {
      code: '<template><meta http-equiv="refresh" content="71999"></template>',
      output: null,
      errors: [{ messageId: 'metaRefreshDelay' }],
    },
    {
      code: '<template><meta name="viewport" content="user-scalable=no"></template>',
      output: null,
      errors: [{ messageId: 'viewportUserScalable' }],
    },
    {
      code: '<template><meta name="viewport" content="user-scalable = no"></template>',
      output: null,
      errors: [{ messageId: 'viewportUserScalable' }],
    },
    {
      code: '<template><meta name="viewport" content="user-scalable= no"></template>',
      output: null,
      errors: [{ messageId: 'viewportUserScalable' }],
    },
    {
      code: '<template><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0"></template>',
      output: null,
      errors: [{ messageId: 'viewportMaximumScale' }],
    },
    {
      code: '<template><meta name="viewport"></template>',
      output: null,
      errors: [{ messageId: 'metaMissingContent' }],
    },
    {
      code: '<template><meta property="og:type"></template>',
      output: null,
      errors: [{ messageId: 'metaMissingContent' }],
    },
    {
      code: '<template><meta itemprop="type"></template>',
      output: null,
      errors: [{ messageId: 'metaMissingContent' }],
    },
    {
      code: '<template><meta http-equiv="refresh"></template>',
      output: null,
      errors: [{ messageId: 'metaMissingContent' }],
    },
    {
      code: '<template><meta content="72001"></template>',
      output: null,
      errors: [{ messageId: 'metaMissingIdentifier' }],
    },
  ],
});
